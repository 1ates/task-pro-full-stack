import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Icon } from "../../components/Icon/Icon.jsx";
import { CreateBoardModal } from "../../components/CreateBoardModal/CreateBoardModal.jsx";
import { EditBoardModal } from "../../components/EditBoardModal/EditBoardModal.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import { HelpModal } from "../../components/HelpModal/HelpModal.jsx";
import { deleteBoard, fetchBoards } from "../../redux/boards/operations.js";
import { logout } from "../../redux/auth/operations.js";
import { selectBoards, selectBoardsLoading } from "../../redux/boards/selectors.js";
import css from "./Sidebar.module.css";

export const Sidebar = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  const isLoading = useSelector(selectBoardsLoading);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deletingBoard, setDeletingBoard] = useState(null);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleDelete = async (event, boardId) => {
    event.preventDefault();
    event.stopPropagation();

    const board = boards.find((item) => item._id === boardId);
    if (!board) return;

    setDeletingBoard(board);
  };

  const confirmDeleteBoard = async () => {
    if (!deletingBoard) return;

    const result = await dispatch(deleteBoard(deletingBoard._id));
    if (deleteBoard.fulfilled.match(result)) {
      const currentPath = window.location.pathname;
      const deletedBoardId = deletingBoard._id;

      setDeletingBoard(null);

      if (currentPath.endsWith(`/home/${deletedBoardId}`)) {
        navigate("/home", { replace: true });
      }
    } else {
      toast.error(result.payload || "Failed to delete board");
    }
  };

  const handleCreated = (boardId) => {
    navigate(`/home/${boardId}`);
  };

  const handleLogout = async () => {
    const result = await dispatch(logout());

    if (logout.fulfilled.match(result)) {
      navigate("/welcome", { replace: true });
      onNavigate?.();
    } else {
      toast.error(result.payload || "Logout failed");
    }
  };

  return (
    <aside className={css.sidebar}>
      <button type='button' className={css.logo} onClick={() => navigate("/home")} aria-label='Go to home'>
        <Icon name='icon-logo' className={css.logoIcon} />

        <span>Task Pro</span>
      </button>

      <div className={css.sectionHeader}>
        <span className={css.sectionTitle}>My boards</span>
      </div>

      <button type='button' className={css.createButton} onClick={() => setIsCreateOpen(true)}>
        <span className={css.createIcon}>
          <Icon name='icon-plus' />
        </span>
        Create a new board
      </button>

      <ul className={css.list}>
        {isLoading && boards.length === 0 ? (
          <li className={css.emptyText}>Loading boards...</li>
        ) : boards.length === 0 ? (
          <li className={css.emptyText}>No boards yet.</li>
        ) : (
          boards.map((board) => (
            <li key={board._id} className={css.item}>
              <NavLink
                to={`/home/${board._id}`}
                onClick={onNavigate}
                className={({ isActive }) => `${css.link} ${isActive ? css.itemActive : ""}`}
              >
                <Icon name={board.icon || "icon-project"} className={css.linkIcon} />
                <span className={css.linkTitle}>{board.title}</span>
              </NavLink>
              <div className={css.itemActions}>
                <button
                  type='button'
                  className={css.iconButton}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setEditingBoard(board);
                  }}
                  aria-label={`Edit ${board.title}`}
                  title='Edit board'
                >
                  <Icon name='icon-edit' />
                </button>
                <button
                  type='button'
                  className={css.iconButton}
                  onClick={(event) => handleDelete(event, board._id)}
                  aria-label={`Delete ${board.title}`}
                  title='Delete board'
                >
                  <Icon name='icon-trash' />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className={css.helpCard}>
        <span className={css.helpIcon}>
          <Icon name='icon-help' />
        </span>
        <p className={css.helpText}>If you have any questions, please contact our support team.</p>
        <button type='button' className={css.helpButton} onClick={() => setIsHelpOpen(true)}>
          Need help?
          <Icon name='icon-arrow-right' />
        </button>
      </div>

      <footer className={css.footer}>
        <button type='button' className={css.footerButton} onClick={handleLogout}>
          <Icon name='icon-logout' />
          Log out
        </button>
      </footer>

      {isCreateOpen && <CreateBoardModal onClose={() => setIsCreateOpen(false)} onCreated={handleCreated} />}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      {editingBoard && <EditBoardModal board={editingBoard} onClose={() => setEditingBoard(null)} />}
      {deletingBoard && (
        <Modal isOpen={Boolean(deletingBoard)} onClose={() => setDeletingBoard(null)}>
          <div className={css.deleteConfirm}>
            <h3>Delete board?</h3>

            <p>
              Are you sure you want to delete <strong>“{deletingBoard.title}”</strong>? This action cannot be undone.
            </p>

            <div className={css.deleteActions}>
              <button type='button' className={css.cancelDelete} onClick={() => setDeletingBoard(null)}>
                No, keep it
              </button>

              <button type='button' className={css.confirmDelete} onClick={confirmDeleteBoard}>
                Yes, delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </aside>
  );
};

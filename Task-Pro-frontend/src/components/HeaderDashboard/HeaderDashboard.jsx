import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Icon } from "../Icon/Icon.jsx";
import Modal from "../Modal/Modal.jsx";
import { EditBoardModal } from "../EditBoardModal/EditBoardModal.jsx";
import { deleteBoard } from "../../redux/boards/operations.js";
import FiltersPanel from "../FiltersPanel/FiltersPanel.jsx";
import css from "./HeaderDashboard.module.css";

const HeaderDashboard = ({ boardTitle, board, filters, onFilterChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const panelRef = useRef(null);

  const handleDelete = async () => {
    const result = await dispatch(deleteBoard(board._id));

    if (deleteBoard.fulfilled.match(result)) {
      setIsDeleteOpen(false);

      navigate("/home");
    } else {
      toast.error(result.payload || "Failed to delete board");
    }
  };

  useEffect(() => {
    if (!isFiltersOpen) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isFiltersOpen]);

  return (
    <header className={css.header}>
      <div className={css.boardInfo}>
        <Icon name={board.icon} className={css.icon} />
        <h2 className={css.title}>{boardTitle || "My board"}</h2>
        <div className={css.boardActions}>
          <button type='button' className={css.iconButton} onClick={() => setIsEditOpen(true)} aria-label='Edit board'>
            <Icon name='icon-edit' />
          </button>
          <button
            type='button'
            className={css.iconButton}
            onClick={() => setIsDeleteOpen(true)}
            aria-label='Delete board'
          >
            <Icon name='icon-trash' />
          </button>
        </div>
      </div>

      <div style={{ position: "relative" }} ref={panelRef}>
        <button
          type='button'
          className={`${css.filterButton} ${
            filters.priority !== "all" || filters.startDate ? css.filterButtonActive : ""
          }`}
          onClick={() => setIsFiltersOpen((prev) => !prev)}
          aria-expanded={isFiltersOpen}
          aria-haspopup='dialog'
        >
          <Icon name='icon-filter' />
          Filters
        </button>

        {isFiltersOpen && (
          <FiltersPanel value={filters} onChange={onFilterChange} onClose={() => setIsFiltersOpen(false)} />
        )}

        {isEditOpen && <EditBoardModal board={board} onClose={() => setIsEditOpen(false)} />}
      </div>

      {isDeleteOpen && (
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <div className={css.deleteConfirm}>
            <h3>Delete board?</h3>

            <p>
              Are you sure you want to delete <strong>“{boardTitle || board.title}”</strong>? This action cannot be
              undone.
            </p>

            <div className={css.deleteActions}>
              <button type='button' className={css.cancelDelete} onClick={() => setIsDeleteOpen(false)}>
                No, keep it
              </button>

              <button type='button' className={css.confirmDelete} onClick={handleDelete}>
                Yes, delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
};

export default HeaderDashboard;

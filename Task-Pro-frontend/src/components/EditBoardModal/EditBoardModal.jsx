import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal.jsx";
import { BoardForm } from "../BoardForm/BoardForm.jsx";
import { deleteBoard, editBoard } from "../../redux/boards/operations.js";
import { selectBoardsLoading } from "../../redux/boards/selectors.js";
import css from "../PublicModal.module.css";

export const EditBoardModal = ({ board, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boardId } = useParams();
  const isLoading = useSelector(selectBoardsLoading);

  const handleSubmit = async (payload) => {
    const result = await dispatch(editBoard({ boardId: board._id, ...payload }));
    if (editBoard.fulfilled.match(result)) {
      onClose();
    } else {
      toast.error(result.payload || "Failed to update board");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteBoard(board._id));
    if (deleteBoard.fulfilled.match(result)) {
      if (boardId === board._id) {
        navigate("/home");
      }
      onClose();
    } else {
      toast.error(result.payload || "Failed to delete board");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className={css.title}>Edit board</h2>
      <BoardForm
        title={board.title}
        icon={board.icon}
        background={board.background}
        submitLabel='Save'
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      <button type='button' className={css.deleteButton} onClick={handleDelete} disabled={isLoading}>
        Delete board
      </button>
    </Modal>
  );
};

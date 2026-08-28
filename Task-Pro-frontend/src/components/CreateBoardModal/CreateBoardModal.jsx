import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal.jsx";
import { BoardForm } from "../BoardForm/BoardForm.jsx";
import { addBoard } from "../../redux/boards/operations.js";
import { selectBoardsLoading } from "../../redux/boards/selectors.js";
import css from "../PublicModal.module.css";

export const CreateBoardModal = ({ onClose, onCreated }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectBoardsLoading);

  const handleSubmit = async (payload) => {
    const result = await dispatch(addBoard(payload));
    if (addBoard.fulfilled.match(result)) {
      onCreated?.(result.payload._id);
      onClose();
    } else {
      toast.error(result.payload || "Failed to create board");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className={css.title}>New board</h2>
      <BoardForm submitLabel='Create' isLoading={isLoading} onSubmit={handleSubmit} />
    </Modal>
  );
};

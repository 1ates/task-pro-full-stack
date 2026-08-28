import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CardForm } from "../CardForm/CardForm.jsx";
import { addCard, editCard, deleteCard } from "../../redux/cards/operations.js";
import { selectCardsLoading } from "../../redux/cards/selectors.js";
import Modal from "../Modal/Modal.jsx";
import css from "../PublicModal.module.css";

const CardModal = ({ columnId, card, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectCardsLoading);
  const isEdit = Boolean(card);

  const handleSubmit = async (payload) => {
    const action = isEdit ? editCard({ cardId: card._id, ...payload }) : addCard({ columnId, ...payload });
    const result = await dispatch(action);

    if ((isEdit && editCard.fulfilled.match(result)) || (!isEdit && addCard.fulfilled.match(result))) {
      onClose();
    } else {
      toast.error(result.payload || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteCard(card._id));
    if (deleteCard.fulfilled.match(result)) onClose();
    else toast.error(result.payload || "Failed to delete card");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={css.title}>{isEdit ? "Edit card" : "Add card"}</h2>
      <CardForm
        title={card?.title}
        description={card?.description}
        priority={card?.priority}
        deadline={card?.deadline}
        submitLabel={isEdit ? "Save" : "Create"}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      {isEdit && (
        <button type='button' className={css.deleteButton} onClick={handleDelete} disabled={isLoading}>
          Delete card
        </button>
      )}
    </Modal>
  );
};

export default CardModal;

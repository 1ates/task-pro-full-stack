import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteColumn } from "../../redux/columns/operations.js";
import { selectCards } from "../../redux/cards/selectors.js";
import { Icon } from "../Icon/Icon.jsx";
import Modal from "../Modal/Modal.jsx";
import Card from "../Card/Card.jsx";
import CardModal from "../CardModal/CardModal.jsx";
import ColumnModal from "../ColumnModal/ColumnModal.jsx";
import css from "./Column.module.css";

const isWithinDateRange = (dateValue, startDate, endDate) => {
  if (!dateValue || (!startDate && !endDate)) return true;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) : null;
  const end = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) : null;

  if (start && normalizedDate < start) return false;
  if (end && normalizedDate > end) return false;
  return true;
};

const Column = ({ column, boardId, filters }) => {
  const dispatch = useDispatch();
  const cards = useSelector(selectCards);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const columnCards = cards.filter((card) => {
    if (card.columnId !== column._id) return false;
    if (filters.priority !== "all" && card.priority !== filters.priority) return false;
    return isWithinDateRange(card.deadline, filters.startDate, filters.endDate);
  });

  const handleDelete = async () => {
    const result = await dispatch(deleteColumn(column._id));

    if (deleteColumn.fulfilled.match(result)) {
      setIsDeleteOpen(false);
    } else {
      toast.error(result.payload || "Failed to delete column");
    }
  };

  return (
    <>
      <section className={css.column} aria-label={`Column: ${column.title}`}>
        <header className={css.header}>
          <h3 className={css.title}>{column.title}</h3>
          <div className={css.headerActions}>
            <button
              type='button'
              className={css.editButton}
              onClick={() => setIsEditOpen(true)}
              aria-label='Edit column'
            >
              <Icon name='icon-edit' />
            </button>
            <button
              type='button'
              className={css.editButton}
              onClick={() => setIsDeleteOpen(true)}
              aria-label='Delete column'
            >
              <Icon name='icon-trash' />
            </button>
          </div>
        </header>

        <div className={css.cardList}>
          {columnCards.map((card) => (
            <Card key={card._id} card={card} columnId={column._id} />
          ))}
        </div>

        <button type='button' className={css.addCardButton} onClick={() => setIsAddCardOpen(true)}>
          <span className={css.addIcon}>
            <Icon name='icon-plus' />
          </span>
          Add another card
        </button>
      </section>

      <CardModal isOpen={isAddCardOpen} onClose={() => setIsAddCardOpen(false)} columnId={column._id} />
      <ColumnModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} boardId={boardId} column={column} />
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <div className={css.deleteConfirm}>
          <h3>Delete column?</h3>

          <p>
            Are you sure you want to delete <strong>“{column.title}”</strong>? All cards in this column will also be
            deleted. This action cannot be undone.
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
    </>
  );
};

export default Column;

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteColumn } from "../../redux/columns/operations.js";
import { selectFilteredCards } from "../../redux/filters/selectors.js";
import Card from "../Card/Card.jsx";
import CardModal from "../CardModal/CardModal.jsx";
import ColumnModal from "../ColumnModal/ColumnModal.jsx";
import css from "./Column.module.css";

const Column = ({ column, boardId }) => {
  const dispatch = useDispatch();
  const filteredCards = useSelector(selectFilteredCards);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Cards belonging to this column, already filtered by priority
  const columnCards = filteredCards.filter(
    (card) => card.columnId === column._id
  );

  const handleDelete = () => {
    dispatch(deleteColumn(column._id));
  };

  return (
    <>
      <section className={css.column} aria-label={`Column: ${column.title}`}>
        {/* Column header */}
        <header className={css.header}>
          <h3 className={css.title}>{column.title}</h3>
          <div className={css.headerActions}>
            <button
              type="button"
              className={css.editButton}
              onClick={() => setIsEditOpen(true)}
              aria-label="Edit column"
              title="Edit column"
            >
              <svg aria-hidden="true">
                <use href="/task-pro/images/icons.svg#icon-pencil-dark" />
              </svg>
            </button>
            <button
              type="button"
              className={css.editButton}
              onClick={handleDelete}
              aria-label="Delete column"
              title="Delete column"
            >
              <svg aria-hidden="true">
                <use href="/task-pro/images/icons.svg#icon-trash-dark" />
              </svg>
            </button>
          </div>
        </header>

        {/* Cards list — vertical scroll */}
        <div className={css.cardList}>
          {columnCards.map((card) => (
            <Card key={card._id} card={card} columnId={column._id} />
          ))}
        </div>

        {/* Add card button — fixed at bottom */}
        <button
          type="button"
          className={css.addCardButton}
          onClick={() => setIsAddCardOpen(true)}
        >
          <span className={css.addIcon}>
            <svg aria-hidden="true">
              <use href="/task-pro/images/icons.svg#icon-plus-create-dark" />
            </svg>
          </span>
          Add another card
        </button>
      </section>

      {/* Add Card Modal */}
      <CardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        columnId={column._id}
      />

      {/* Edit Column Modal */}
      <ColumnModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        boardId={boardId}
        column={column}
      />
    </>
  );
};

export default Column;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { deleteCard, moveCard } from "../../redux/cards/operations.js";
import { selectColumns } from "../../redux/columns/selectors.js";
import Modal from "../Modal/Modal.jsx";
import CardModal from "../CardModal/CardModal.jsx";
import { Icon } from "../Icon/Icon.jsx";
import css from "./Card.module.css";

const PRIORITY_COLORS = {
  without: "var(--priority-without)",
  low: "var(--priority-low)",
  medium: "var(--priority-medium)",
  high: "var(--priority-high)",
};

const PRIORITY_LABELS = {
  without: "Without priority",
  low: "Low",
  medium: "Medium",
  high: "High",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const isDueToday = (date) => {
  const today = new Date();
  const deadline = new Date(date);
  return (
    today.getFullYear() === deadline.getFullYear() &&
    today.getMonth() === deadline.getMonth() &&
    today.getDate() === deadline.getDate()
  );
};

const Card = ({ card, columnId }) => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const moveRef = useRef(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (!isMoveOpen) return undefined;
    const handleClick = (event) => {
      if (moveRef.current && !moveRef.current.contains(event.target)) setIsMoveOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMoveOpen]);

  const handleDelete = async () => {
    const result = await dispatch(deleteCard(card._id));

    if (deleteCard.fulfilled.match(result)) {
      setIsDeleteOpen(false);
    } else {
      toast.error(result.payload || "Failed to delete card");
    }
  };

  const handleMove = async (targetColumnId) => {
    const result = await dispatch(moveCard({ cardId: card._id, targetColumnId }));
    if (moveCard.fulfilled.match(result)) setIsMoveOpen(false);
    else toast.error(result.payload || "Failed to move card");
  };

  const isDeadlineToday = card.deadline && isDueToday(card.deadline);
  const formattedDeadline = card.deadline ? formatDate(card.deadline) : null;
  const priorityColor = PRIORITY_COLORS[card.priority] || PRIORITY_COLORS.without;

  const currentColumnId = String(columnId);

  const moveTargets = columns.filter((column) => String(column._id) !== currentColumnId);

  return (
    <>
      <article className={css.card}>
        <span className={css.priorityBar} style={{ backgroundColor: priorityColor }} aria-hidden='true' />
        <h4 className={css.title}>{card.title}</h4>
        {card.description && <p className={css.description}>{card.description}</p>}

        <div className={css.footer}>
          <div className={css.metaCol}>
            <span className={css.metaLabel}>Priority</span>
            <span className={css.priorityLabel}>
              <span className={css.priorityDot} style={{ backgroundColor: priorityColor }} />
              {PRIORITY_LABELS[card.priority] || "Without priority"}
            </span>
          </div>

          {formattedDeadline && (
            <div className={css.metaCol}>
              <span className={css.metaLabel}>Deadline</span>
              <span className={css.dateRow}>
                {formattedDeadline}
                {isDeadlineToday && <Icon name='icon-bell' className={css.bellIcon} />}
              </span>
            </div>
          )}

          <div className={css.actions} ref={moveRef}>
            {moveTargets.length > 0 && (
              <button
                type='button'
                className={css.iconButton}
                onClick={() => setIsMoveOpen((prev) => !prev)}
                aria-label='Move card'
              >
                <Icon name='icon-move' />
              </button>
            )}
            <button type='button' className={css.iconButton} onClick={() => setIsEditOpen(true)} aria-label='Edit card'>
              <Icon name='icon-edit' />
            </button>
            <button
              type='button'
              className={css.iconButton}
              onClick={() => setIsDeleteOpen(true)}
              aria-label='Delete card'
            >
              <Icon name='icon-trash' />
            </button>

            {isMoveOpen && (
              <ul className={css.moveMenu} role='menu'>
                {moveTargets.map((column) => (
                  <li key={column._id}>
                    <button
                      type='button'
                      className={css.moveMenuItem}
                      onClick={() => handleMove(column._id)}
                      role='menuitem'
                    >
                      {column.title}
                      <span className={css.moveMenuIcon}>
                        <Icon name='icon-arrow-right' />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>

      <CardModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} columnId={columnId} card={card} />

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <div className={css.deleteConfirm}>
          <h3>Delete card?</h3>

          <p>
            Are you sure you want to delete <strong>“{card.title}”</strong>? This action cannot be undone.
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

export default Card;

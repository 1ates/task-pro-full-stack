import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCard, moveCard } from "../../redux/cards/operations.js";
import { selectColumns } from "../../redux/columns/selectors.js";
import CardModal from "../CardModal/CardModal.jsx";
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

const Card = ({ card, columnId }) => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const moveRef = useRef(null);

  // Close move menu on outside click
  useEffect(() => {
    if (!isMoveOpen) return;
    const handleClick = (e) => {
      if (moveRef.current && !moveRef.current.contains(e.target)) {
        setIsMoveOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMoveOpen]);

  const handleDelete = () => {
    dispatch(deleteCard(card._id));
  };

  const handleMove = (targetColumnId) => {
    dispatch(moveCard({ cardId: card._id, targetColumnId }));
    setIsMoveOpen(false);
  };

  // Check if deadline is today
  const isDeadlineToday = (() => {
    if (!card.deadline) return false;
    const today = new Date();
    const deadline = new Date(card.deadline);
    return (
      today.getFullYear() === deadline.getFullYear() &&
      today.getMonth() === deadline.getMonth() &&
      today.getDate() === deadline.getDate()
    );
  })();

  const formattedDeadline = card.deadline
    ? new Date(card.deadline).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : null;

  const priorityColor = PRIORITY_COLORS[card.priority] || PRIORITY_COLORS.without;

  // Other columns to move to
  const moveTargets = columns.filter((col) => col._id !== columnId);

  return (
    <>
      <article className={css.card}>
        {/* Priority color bar */}
        <span
          className={css.priorityBar}
          style={{ backgroundColor: priorityColor }}
          aria-hidden="true"
        />

        <h4 className={css.title}>{card.title}</h4>

        {card.description && (
          <p className={css.description}>{card.description}</p>
        )}

        <hr className={css.divider} />

        <div className={css.footer}>
          {/* Priority */}
          <div className={css.metaCol}>
            <span className={css.metaLabel}>Priority</span>
            <span className={css.priorityLabel}>
              <span
                className={css.priorityDot}
                style={{ backgroundColor: priorityColor }}
              />
              {PRIORITY_LABELS[card.priority] || "Without priority"}
            </span>
          </div>

          {/* Deadline */}
          {formattedDeadline && (
            <div className={css.metaCol}>
              <span className={css.metaLabel}>Deadline</span>
              <span className={css.dateRow}>
                {formattedDeadline}
                {isDeadlineToday && (
                  <svg className={css.bellIcon} aria-label="Deadline is today">
                    <use href="/task-pro/images/icons.svg#icon-bell-dark" />
                  </svg>
                )}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className={css.actions} ref={moveRef}>
            {/* Move */}
            {moveTargets.length > 0 && (
              <button
                type="button"
                className={css.iconButton}
                onClick={() => setIsMoveOpen((prev) => !prev)}
                aria-label="Move card to another column"
                title="Move card"
              >
                <svg aria-hidden="true">
                  <use href="/task-pro/images/icons.svg#icon-arrow-circle-dark" />
                </svg>
              </button>
            )}

            {/* Edit */}
            <button
              type="button"
              className={css.iconButton}
              onClick={() => setIsEditOpen(true)}
              aria-label="Edit card"
              title="Edit card"
            >
              <svg aria-hidden="true">
                <use href="/task-pro/images/icons.svg#icon-pencil-dark" />
              </svg>
            </button>

            {/* Delete */}
            <button
              type="button"
              className={css.iconButton}
              onClick={handleDelete}
              aria-label="Delete card"
              title="Delete card"
            >
              <svg aria-hidden="true">
                <use href="/task-pro/images/icons.svg#icon-trash-dark" />
              </svg>
            </button>

            {/* Move popover menu */}
            {isMoveOpen && (
              <ul className={css.moveMenu} role="menu">
                {moveTargets.map((col) => (
                  <li key={col._id}>
                    <button
                      type="button"
                      className={css.moveMenuItem}
                      onClick={() => handleMove(col._id)}
                      role="menuitem"
                    >
                      {col.title}
                      <span className={css.moveMenuIcon}>
                        <svg aria-hidden="true">
                          <use href="/task-pro/images/icons.svg#icon-arrow-circle-dark" />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>

      {/* Edit Card Modal */}
      <CardModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        columnId={columnId}
        card={card}
      />
    </>
  );
};

export default Card;

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className={css.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className={css.closeIcon} aria-hidden="true">
            <use href="/task-pro/images/icons.svg#icon-x-close" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

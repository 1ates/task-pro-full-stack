import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../Icon/Icon.jsx";
import css from "./Modal.module.css";

const modalRoot = document.getElementById("root");

const Modal = ({ isOpen = true, onClose, className, children }) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick} role='dialog' aria-modal='true'>
      <div className={`${css.modal} ${className || ""}`} onClick={(event) => event.stopPropagation()}>
        <button type='button' className={css.closeButton} onClick={onClose} aria-label='Close modal'>
          <Icon name='icon-x' className={css.closeIcon} />
        </button>
        {children}
      </div>
    </div>,
    modalRoot,
  );
};

export default Modal;

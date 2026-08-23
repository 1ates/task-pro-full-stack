import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../Icon/Icon.jsx";
import css from "./Modal.module.css";

// Ortak, tekrar kullanilabilir modal kabuğu.
// Board/Card/Column modallari gibi diger tum modallar bunu sarmalayabilir.
export const Modal = ({ onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button type='button' className={css.closeButton} onClick={onClose} aria-label='Close'>
          <Icon name='icon-x-close' className={css.closeIcon} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

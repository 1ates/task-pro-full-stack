import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal.jsx";
import { selectUser } from "../../redux/auth/selectors.js";
import { emailSchema } from "../../schemas/validationSchemas.js";
import { api } from "../../services/api.js";
import css from "../PublicModal.module.css";

export const HelpModal = ({ onClose }) => {
  const user = useSelector(selectUser);
  const [email, setEmail] = useState(user?.email || "");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedComment = comment.trim();
    const nextErrors = {};

    try {
      await emailSchema.validate(trimmedEmail);
    } catch (err) {
      nextErrors.email = err.message;
    }
    if (!trimmedComment) {
      nextErrors.comment = "Comment is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/help", { email: trimmedEmail, comment: trimmedComment });
      toast.success("Your message has been sent");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className={css.title}>Need help</h2>
      <form className={css.form} onSubmit={handleSubmit} noValidate>
        <div className={css.field}>
          <input
            className={`${css.input} ${errors.email ? css.inputError : ""}`}
            type='email'
            placeholder='Email address'
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email && <span className={css.error}>{errors.email}</span>}
        </div>
        <div className={css.field}>
          <textarea
            className={`${css.textarea} ${errors.comment ? css.inputError : ""}`}
            placeholder='Comment'
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
              setErrors((prev) => ({ ...prev, comment: undefined }));
            }}
          />
          {errors.comment && <span className={css.error}>{errors.comment}</span>}
        </div>
        <button className={css.submit} type='submit' disabled={isLoading}>
          Send
        </button>
      </form>
    </Modal>
  );
};

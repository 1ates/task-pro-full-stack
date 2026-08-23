import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { columnSchema } from "../../schemas/boardSchemas.js";
import { addColumn, editColumn } from "../../redux/columns/operations.js";
import Modal from "../Modal/Modal.jsx";
import css from "../PublicModal.module.css";

const ColumnModal = ({ isOpen, onClose, boardId, column = null }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(column);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(columnSchema),
    defaultValues: {
      title: column?.title || "",
    },
  });

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await dispatch(
          editColumn({ columnId: column._id, title: values.title })
        ).unwrap();
      } else {
        await dispatch(
          addColumn({ boardId, title: values.title })
        ).unwrap();
      }
      reset();
      onClose();
    } catch {
      // Error handled by Redux slice
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={css.title}>{isEdit ? "Edit column" : "Add column"}</h2>

      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={css.field}>
          <input
            className={`${css.input} ${errors.title ? css.inputError : ""}`}
            type="text"
            placeholder="Title"
            autoFocus
            {...register("title")}
          />
          {errors.title && (
            <span className={css.error}>{errors.title.message}</span>
          )}
        </div>

        <button
          type="submit"
          className={css.submit}
          disabled={isSubmitting}
        >
          <span className={css.submitIcon}>
            <svg aria-hidden="true">
              <use href="/task-pro/images/icons.svg#icon-plus-create-dark" />
            </svg>
          </span>
          {isEdit ? "Edit" : "Add"}
        </button>
      </form>
    </Modal>
  );
};

export default ColumnModal;

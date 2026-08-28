import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addColumn, editColumn, deleteColumn } from "../../redux/columns/operations.js";
import { selectColumnsLoading } from "../../redux/columns/selectors.js";
import { Icon } from "../Icon/Icon.jsx";
import Modal from "../Modal/Modal.jsx";
import css from "../PublicModal.module.css";

const ColumnModal = ({ isOpen, onClose, boardId, column = null }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectColumnsLoading);
  const isEdit = Boolean(column);
  const [title, setTitle] = useState(column?.title || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(column?.title || "");
      setError("");
    }
  }, [isOpen, column]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }
    if (trimmedTitle.length > 64) {
      setError("Title must be at most 64 characters");
      return;
    }

    const action = isEdit
      ? editColumn({ columnId: column._id, title: trimmedTitle })
      : addColumn({ boardId, title: trimmedTitle });
    const result = await dispatch(action);

    if ((isEdit && editColumn.fulfilled.match(result)) || (!isEdit && addColumn.fulfilled.match(result))) {
      onClose();
    } else {
      toast.error(result.payload || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteColumn(column._id));
    if (deleteColumn.fulfilled.match(result)) {
      setTitle("");
      setError("");
      onClose();
    } else {
      toast.error(result.payload || "Failed to delete column");
    }
  };

  return (
    <Modal
      key={`${isOpen}-${column?._id || "new"}`}
      isOpen={isOpen}
      onClose={() => {
        setTitle("");
        setError("");
        onClose();
      }}
    >
      <h2 className={css.title}>{isEdit ? "Edit column" : "Add column"}</h2>
      <form className={css.form} onSubmit={handleSubmit} noValidate>
        <div className={css.field}>
          <input
            className={`${css.input} ${error ? css.inputError : ""}`}
            type='text'
            placeholder='Title'
            autoFocus
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError("");
            }}
          />
          {error && <span className={css.error}>{error}</span>}
        </div>
        <button type='submit' className={css.submit} disabled={isLoading}>
          <span className={css.submitIcon}>
            <Icon name='icon-plus' />
          </span>
          {isEdit ? "Save" : "Add"}
        </button>
      </form>
      {isEdit && (
        <button type='button' className={css.deleteButton} onClick={handleDelete} disabled={isLoading}>
          Delete column
        </button>
      )}
    </Modal>
  );
};

export default ColumnModal;

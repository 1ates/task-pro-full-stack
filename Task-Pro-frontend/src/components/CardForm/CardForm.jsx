import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "../Icon/Icon.jsx";
import { PRIORITY_OPTIONS } from "../../constants/boardOptions.js";
import css from "../PublicModal.module.css";

const priorityColorVar = {
  without: "var(--priority-without)",
  low: "var(--priority-low)",
  medium: "var(--priority-medium)",
  high: "var(--priority-high)",
};

export const CardForm = ({
  title: initialTitle = "",
  description: initialDescription = "",
  priority: initialPriority = "without",
  deadline: initialDeadline,
  isLoading,
  submitLabel,
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState(initialPriority);
  const [deadline, setDeadline] = useState(initialDeadline ? new Date(initialDeadline) : new Date());
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!description.trim()) nextErrors.description = "Description is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline,
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.field}>
        <input
          className={`${css.input} ${errors.title ? css.inputError : ""}`}
          type='text'
          placeholder='Title'
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrors((prev) => ({ ...prev, title: undefined }));
          }}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.field}>
        <textarea
          className={`${css.textarea} ${errors.description ? css.inputError : ""}`}
          placeholder='Description'
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            setErrors((prev) => ({ ...prev, description: undefined }));
          }}
        />
        {errors.description && <span className={css.error}>{errors.description}</span>}
      </div>

      <div className={css.field}>
        <span className={css.label}>Label color</span>
        <div className={css.priorityRow}>
          {PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type='button'
              className={`${css.priorityOption} ${priority === option.value ? css.priorityActive : ""}`}
              onClick={() => setPriority(option.value)}
              aria-label={option.label}
            >
              <span className={css.priorityDot} style={{ backgroundColor: priorityColorVar[option.value] }} />
            </button>
          ))}
        </div>
      </div>

      <div className={css.field}>
        <span className={css.label}>Deadline</span>
        <DatePicker
          className={css.input}
          selected={deadline}
          onChange={(date) => setDeadline(date)}
          dateFormat='dd/MM/yyyy'
          minDate={new Date()}
        />
      </div>

      <button className={css.submit} type='submit' disabled={isLoading}>
        <span className={css.submitIcon}>
          <Icon name='icon-plus' />
        </span>
        {submitLabel}
      </button>
    </form>
  );
};

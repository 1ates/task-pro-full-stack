import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cardSchema } from "../../schemas/boardSchemas.js";
import { addCard, editCard } from "../../redux/cards/operations.js";
import Modal from "../Modal/Modal.jsx";
import css from "../PublicModal.module.css";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
  // Simple check to see if the selected date is today
  const isToday = (() => {
    if (!value) return false;
    const dateStr = new Date(value).toDateString();
    const todayStr = new Date().toDateString();
    return dateStr === todayStr;
  })();

  const displayValue = isToday 
    ? `Today, ${value}`
    : value;

  return (
    <button
      type="button"
      className={css.datePickerButton}
      onClick={onClick}
      ref={ref}
    >
      {displayValue || "Select a date"}
      <svg className={css.chevronIcon} width="16" height="16">
        <use href="/task-pro/images/icons.svg#icon-arrow-circle-dark" />
      </svg>
    </button>
  );
});

const PRIORITIES = [
  { value: "without", label: "Without priority", color: "var(--priority-without)" },
  { value: "low", label: "Low", color: "var(--priority-low)" },
  { value: "medium", label: "Medium", color: "var(--priority-medium)" },
  { value: "high", label: "High", color: "var(--priority-high)" },
];

const CardModal = ({ isOpen, onClose, columnId, card = null }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(card);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(cardSchema),
    defaultValues: {
      title: card?.title || "",
      description: card?.description || "",
      priority: card?.priority || "without",
      deadline: card?.deadline ? new Date(card.deadline) : null,
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : null,
      };

      if (isEdit) {
        await dispatch(editCard({ cardId: card._id, ...payload })).unwrap();
      } else {
        await dispatch(addCard({ columnId, ...payload })).unwrap();
      }
      reset();
      onClose();
    } catch {
      // Error handled by Redux slice
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={css.title}>{isEdit ? "Edit card" : "Add card"}</h2>

      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
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

        {/* Description */}
        <div className={css.field}>
          <textarea
            className={`${css.textarea} ${errors.description ? css.inputError : ""}`}
            placeholder="Description"
            rows={4}
            {...register("description")}
          />
          {errors.description && (
            <span className={css.error}>{errors.description.message}</span>
          )}
        </div>

        {/* Priority */}
        <div className={css.field}>
          <span className={css.label}>Priority</span>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <div className={css.priorityRow}>
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`${css.priorityOption} ${
                      field.value === p.value ? css.priorityActive : ""
                    }`}
                    style={{ color: p.color }}
                    onClick={() => field.onChange(p.value)}
                    title={p.label}
                    aria-label={p.label}
                  >
                    <span
                      className={css.priorityDot}
                      style={{ backgroundColor: p.color }}
                    />
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Deadline */}
        <div className={css.field}>
          <span className={css.label}>Deadline</span>
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                minDate={new Date()}
                dateFormat="MMMM d"
                placeholderText="Select a date"
                customInput={<CustomDateInput />}
              />
            )}
          />
        </div>

        {/* Submit */}
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

export default CardModal;

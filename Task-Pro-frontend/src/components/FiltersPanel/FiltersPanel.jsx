import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "../Icon/Icon.jsx";
import { PRIORITY_OPTIONS } from "../../constants/boardOptions";
import css from "./FiltersPanel.module.css";

const PRIORITY_COLOR_VAR = {
  without: "var(--border-color)",
  low: "var(--priority-low)",
  medium: "var(--priority-medium)",
  high: "var(--priority-high)",
};

const EMPTY_FILTERS = { priority: "all", startDate: null, endDate: null };

const FiltersPanel = ({ value, onChange, onClose }) => {
  const { priority, startDate, endDate } = value;

  const handlePriorityChange = (nextPriority) => {
    onChange({ ...value, priority: nextPriority });
  };

  const handleDateChange = ([nextStart, nextEnd]) => {
    onChange({ ...value, startDate: nextStart, endDate: nextEnd });
  };

  return (
    <div className={css.panel}>
      <div className={css.header}>
        <h3 className={css.title}>Filters</h3>
        <button type='button' className={css.closeButton} onClick={onClose} aria-label='Close filters'>
          <Icon name='icon-x' />
        </button>
      </div>

      <div className={css.subHeader}>
        <span className={css.subTitle}>Label color</span>
        <button type='button' className={css.showAll} onClick={() => onChange(EMPTY_FILTERS)}>
          Show all
        </button>
      </div>

      <div className={css.options}>
        {PRIORITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type='button'
            className={`${css.option} ${priority === option.value ? css.optionActive : ""}`}
            onClick={() => handlePriorityChange(option.value)}
          >
            <span className={css.radio} style={{ borderColor: PRIORITY_COLOR_VAR[option.value] }}>
              <span className={css.radioDot} style={{ backgroundColor: PRIORITY_COLOR_VAR[option.value] }} />
            </span>
            {option.label}
          </button>
        ))}
      </div>

      <div className={css.subHeader}>
        <span className={css.subTitle}>Deadline</span>
        {(startDate || endDate) && (
          <button
            type='button'
            className={css.showAll}
            onClick={() => onChange({ ...value, startDate: null, endDate: null })}
          >
            Clear
          </button>
        )}
      </div>

      <DatePicker selectsRange inline startDate={startDate} endDate={endDate} onChange={handleDateChange} />
    </div>
  );
};

export default FiltersPanel;

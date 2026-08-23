import { useSelector, useDispatch } from "react-redux";
import { selectFilterPriority } from "../../redux/filters/selectors.js";
import { setFilterPriority } from "../../redux/filters/slice.js";
import { updateBoardBackground } from "../../redux/boards/slice.js";
import { BOARD_BACKGROUNDS } from "../../constants/boardOptions.js";
import css from "./FiltersPanel.module.css";

const PRIORITIES = [
  { value: "all", label: "All", color: null },
  { value: "without", label: "Without priority", color: "var(--priority-without)" },
  { value: "low", label: "Low", color: "var(--priority-low)" },
  { value: "medium", label: "Medium", color: "var(--priority-medium)" },
  { value: "high", label: "High", color: "var(--priority-high)" },
];

const FiltersPanel = ({ onClose }) => {
  const dispatch = useDispatch();
  const activePriority = useSelector(selectFilterPriority);
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const activeBg = activeBoard?.background || null;

  const handlePrioritySelect = (value) => {
    dispatch(setFilterPriority(value));
  };

  const handleBgSelect = (bgName) => {
    dispatch(updateBoardBackground(bgName));
  };

  const handleShowAll = () => {
    dispatch(setFilterPriority("all"));
  };

  return (
    <aside className={css.panel} role="dialog" aria-label="Filters">
      {/* Header */}
      <div className={css.header}>
        <h3 className={css.title}>Filters</h3>
        <button
          type="button"
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close filters"
        >
          <svg aria-hidden="true">
            <use href="/task-pro/images/icons.svg#icon-x-close" />
          </svg>
        </button>
      </div>

      {/* Background Selection Section */}
      <div className={css.subHeader}>
        <span className={css.subTitle}>Board background</span>
      </div>
      <div className={css.bgGrid}>
        {BOARD_BACKGROUNDS.map((bg) => {
          const isActive = activeBg === bg;
          if (bg === null) {
            return (
              <button
                key="none"
                type="button"
                className={`${css.bgSwatch} ${css.bgSwatchNone} ${
                  isActive ? css.bgSwatchActive : ""
                }`}
                onClick={() => handleBgSelect(null)}
                aria-label="No background"
              >
                <svg width="16" height="16">
                  <use href="/task-pro/images/icons.svg#icon-colors-dark" />
                </svg>
              </button>
            );
          }
          const bgUrl = `/task-pro/images/background/mobile/${bg}-mobile.jpg`;
          return (
            <button
              key={bg}
              type="button"
              className={`${css.bgSwatch} ${isActive ? css.bgSwatchActive : ""}`}
              style={{ backgroundImage: `url(${bgUrl})` }}
              onClick={() => handleBgSelect(bg)}
              aria-label={`Background ${bg}`}
            />
          );
        })}
      </div>

      {/* Priority Section */}
      <div className={css.subHeader}>
        <span className={css.subTitle}>Label color</span>
        <button
          type="button"
          className={css.showAll}
          onClick={handleShowAll}
        >
          Show all
        </button>
      </div>

      <div className={css.options} role="radiogroup" aria-label="Priority filter">
        {PRIORITIES.map((p) => {
          const isActive = activePriority === p.value;
          return (
            <button
              key={p.value}
              type="button"
              className={`${css.option} ${isActive ? css.optionActive : ""}`}
              onClick={() => handlePrioritySelect(p.value)}
              role="radio"
              aria-checked={isActive}
            >
              <span className={css.radio}>
                <span
                  className={css.radioDot}
                  style={{
                    backgroundColor: isActive
                      ? p.color || "var(--accent)"
                      : "transparent",
                  }}
                />
              </span>
              {p.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default FiltersPanel;

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectFilterPriority } from "../../redux/filters/selectors.js";
import FiltersPanel from "../FiltersPanel/FiltersPanel.jsx";
import css from "./HeaderDashboard.module.css";

const HeaderDashboard = ({ boardTitle }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const activePriority = useSelector(selectFilterPriority);
  const panelRef = useRef(null);

  const hasActiveFilter = activePriority !== "all";

  // Close panel on outside click
  useEffect(() => {
    if (!isFiltersOpen) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isFiltersOpen]);

  return (
    <header className={css.header}>
      <div className={css.boardInfo}>
        <h2 className={css.title}>{boardTitle || "My board"}</h2>
      </div>

      {/* Filters button & panel */}
      <div style={{ position: "relative" }} ref={panelRef}>
        <button
          type="button"
          className={`${css.filterButton} ${
            hasActiveFilter ? css.filterButtonActive : ""
          }`}
          onClick={() => setIsFiltersOpen((prev) => !prev)}
          aria-expanded={isFiltersOpen}
          aria-haspopup="dialog"
        >
          <svg aria-hidden="true">
            <use href="/task-pro/images/icons.svg#icon-filter-dark" />
          </svg>
          Filters
        </button>

        {isFiltersOpen && (
          <FiltersPanel onClose={() => setIsFiltersOpen(false)} />
        )}
      </div>
    </header>
  );
};

export default HeaderDashboard;

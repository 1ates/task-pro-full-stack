import { useState } from "react";
import { useSelector } from "react-redux";
import { selectColumns } from "../../redux/columns/selectors.js";
import Column from "../Column/Column.jsx";
import ColumnModal from "../ColumnModal/ColumnModal.jsx";
import css from "./MainDashboard.module.css";

const MainDashboard = ({ boardId }) => {
  const columns = useSelector(selectColumns);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  return (
    <>
      <main className={css.main}>
        {/* Columns — horizontal scroll */}
        {columns.map((column) => (
          <Column key={column._id} column={column} boardId={boardId} />
        ))}

        {/* Add column button */}
        <button
          type="button"
          className={css.addColumnButton}
          onClick={() => setIsAddColumnOpen(true)}
        >
          <span className={css.addIcon}>
            <svg aria-hidden="true">
              <use href="/task-pro/images/icons.svg#icon-plus-create-dark" />
            </svg>
          </span>
          Add another column
        </button>
      </main>

      {/* Add Column Modal */}
      <ColumnModal
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        boardId={boardId}
      />
    </>
  );
};

export default MainDashboard;

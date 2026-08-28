import { useState } from "react";
import { useSelector } from "react-redux";
import { selectColumns } from "../../redux/columns/selectors.js";
import { Icon } from "../Icon/Icon.jsx";
import Column from "../Column/Column.jsx";
import ColumnModal from "../ColumnModal/ColumnModal.jsx";
import css from "./MainDashboard.module.css";

const MainDashboard = ({ boardId, filters }) => {
  const columns = useSelector(selectColumns);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  return (
    <>
      <main className={css.main}>
        {columns.map((column) => (
          <Column key={column._id} column={column} boardId={boardId} filters={filters} />
        ))}

        <button type='button' className={css.addColumnButton} onClick={() => setIsAddColumnOpen(true)}>
          <span className={css.addIcon}>
            <Icon name='icon-plus' />
          </span>
          Add another column
        </button>
      </main>

      <ColumnModal isOpen={isAddColumnOpen} onClose={() => setIsAddColumnOpen(false)} boardId={boardId} />
    </>
  );
};

export default MainDashboard;

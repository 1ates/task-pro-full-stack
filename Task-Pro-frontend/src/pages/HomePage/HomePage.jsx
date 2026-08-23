import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import clsx from "clsx";
import { Header } from "../../components/Header/Header.jsx";
import { Sidebar } from "../../layouts/Sidebar/Sidebar.jsx";
import css from "./HomePage.module.css";

// NOT: redux/boards henuz yazilmadigi icin board listesi simdilik bos.
// Board ozelligi eklenince buraya useSelector(selectBoards) baglanmali.
const HomePage = () => {
  const { boardId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={css.layout}>
      <div className={clsx(css.sidebar, sidebarOpen && css.sidebarOpen)}>
        <Sidebar boards={[]} />
      </div>

      {sidebarOpen && (
        <div className={css.backdrop} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={css.content}>
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className={css.main}>
          {boardId ? <Outlet /> : <p className={css.placeholder}>Select or create a board to get started</p>}
        </main>
      </div>
    </div>
  );
};

export default HomePage;

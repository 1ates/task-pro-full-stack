import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import HeaderDashboard from "../../components/HeaderDashboard/HeaderDashboard.jsx";
import MainDashboard from "../../components/MainDashboard/MainDashboard.jsx";
import { fetchBoardById } from "../../redux/boards/operations.js";
import { selectCurrentBoard, selectCurrentBoardLoading } from "../../redux/boards/selectors.js";
import { clearCurrentBoard } from "../../redux/boards/slice.js";
import { setColumns, clearColumns } from "../../redux/columns/slice.js";
import { setCards, clearCards } from "../../redux/cards/slice.js";
import { getBackgroundUrls } from "../../utils/backgroundHelper.js";
import { Loader } from "../../components/Loader/Loader.jsx";
import clsx from "clsx";
import css from "./ScreensPage.module.css";

const ScreensPage = () => {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const activeBoard = useSelector(selectCurrentBoard);
  const isLoading = useSelector(selectCurrentBoardLoading);
  const [filters, setFilters] = useState({
    priority: "all",
    startDate: null,
    endDate: null,
  });
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
  }));

  const backgroundName = activeBoard?.background || null;
  const urls = getBackgroundUrls(backgroundName);

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        devicePixelRatio: window.devicePixelRatio,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadBoard = async () => {
      const result = await dispatch(fetchBoardById(boardId));
      if (fetchBoardById.fulfilled.match(result)) {
        const columns = result.payload.columns || [];
        dispatch(setColumns(columns));
        dispatch(setCards(columns.flatMap((column) => column.cards || [])));
      }
    };

    loadBoard();

    return () => {
      dispatch(clearCurrentBoard());
      dispatch(clearColumns());
      dispatch(clearCards());
    };
  }, [dispatch, boardId]);

  if (isLoading || !activeBoard) return <Loader />;

  return (
    <section
      className={clsx(css.page, backgroundName && css.hasBackground)}
      style={
        urls
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${urls.selected})`,
            }
          : undefined
      }
    >
      <HeaderDashboard
        boardTitle={activeBoard.title}
        board={activeBoard}
        filters={filters}
        onFilterChange={setFilters}
      />
      <MainDashboard boardId={activeBoard._id} filters={filters} />
    </section>
  );
};

export default ScreensPage;

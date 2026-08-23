import { useSelector } from "react-redux";
import clsx from "clsx";
import HeaderDashboard from "../../components/HeaderDashboard/HeaderDashboard.jsx";
import MainDashboard from "../../components/MainDashboard/MainDashboard.jsx";
import { getBackgroundUrls } from "../../utils/backgroundHelper.js";
import css from "./ScreensPage.module.css";

const ScreensPage = () => {
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const backgroundName = activeBoard?.background || null;
  const urls = getBackgroundUrls(backgroundName);

  const backgroundStyle = urls
    ? {
        "--bg-mobile-1x": `url(${urls.mobile1x})`,
        "--bg-mobile-2x": `url(${urls.mobile2x})`,
        "--bg-tablet-1x": `url(${urls.tablet1x})`,
        "--bg-tablet-2x": `url(${urls.tablet2x})`,
        "--bg-desktop-1x": `url(${urls.desktop1x})`,
        "--bg-desktop-2x": `url(${urls.desktop2x})`,
      }
    : undefined;

  return (
    <section
      className={clsx(css.page, backgroundName && css.hasBackground)}
      style={backgroundStyle}
    >
      <HeaderDashboard boardTitle={activeBoard?.title} />
      <MainDashboard boardId={activeBoard?._id} />
    </section>
  );
};

export default ScreensPage;

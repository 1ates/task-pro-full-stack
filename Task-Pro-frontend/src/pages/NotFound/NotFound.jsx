import { Link } from "react-router-dom";
import css from "./NotFound.module.css";

const NotFoundPage = () => (
  <div className={css.page}>
    <h1 className={css.title}>404</h1>
    <p className={css.text}>Page not found</p>
    <Link to='/welcome' className={css.link}>
      Back to home
    </Link>
  </div>
);

export default NotFoundPage;

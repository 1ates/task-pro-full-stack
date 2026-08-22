import css from "./Loader.module.css";

export const Loader = () => (
  <div className={css.wrapper}>
    <span className={css.spinner} />
  </div>
);

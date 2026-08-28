import { useState } from "react";
import clsx from "clsx";
import { Icon } from "../Icon/Icon.jsx";
import css from "../Public.module.css";

export const PasswordField = ({ register, name, error, placeholder, autoComplete = "current-password" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={css.field}>
      <div className={css.passwordWrapper}>
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={clsx(css.input, error && css.inputError)}
          {...register(name)}
        />
        <button
          type='button'
          className={css.eyeButton}
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <Icon name={visible ? "icon-eye" : "icon-eye-off"} />
        </button>
      </div>
      {error && <span className={css.error}>{error.message}</span>}
    </div>
  );
};

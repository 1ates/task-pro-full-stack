import { useState } from "react";
import { Icon } from "../Icon/Icon.jsx";
import { BOARD_BACKGROUNDS, BOARD_ICONS } from "../../constants/boardOptions.js";
import { BOARD_BACKGROUND_IMAGES } from "../../constants/boardBackgrounds.js";
import css from "../PublicModal.module.css";

export const BoardForm = ({
  title: initialTitle = "",
  icon: initialIcon = BOARD_ICONS[0],
  background: initialBackground = null,
  isLoading,
  submitLabel,
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [icon, setIcon] = useState(initialIcon);
  const [background, setBackground] = useState(initialBackground);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }
    if (trimmedTitle.length > 64) {
      setError("Title must be at most 64 characters");
      return;
    }
    onSubmit({ title: trimmedTitle, icon, background });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.field}>
        <input
          className={`${css.input} ${error ? css.inputError : ""}`}
          type='text'
          name='title'
          placeholder='Title'
          value={title}
          maxLength={64}
          onChange={(event) => {
            setTitle(event.target.value);
            setError("");
          }}
        />
        {error && <span className={css.error}>{error}</span>}
      </div>

      <div className={css.field}>
        <span className={css.label}>Icons</span>
        <div className={css.swatchRow}>
          {BOARD_ICONS.map((iconName) => (
            <button
              key={iconName}
              type='button'
              className={`${css.swatch} ${icon === iconName ? css.swatchActive : ""}`}
              onClick={() => setIcon(iconName)}
              aria-label={iconName}
              aria-pressed={icon === iconName}
            >
              <Icon name={iconName} />
            </button>
          ))}
        </div>
      </div>

      <div className={css.field}>
        <span className={css.label}>Background</span>
        <div className={css.swatchRow}>
          {BOARD_BACKGROUNDS.map((bg) => (
            <button
              key={bg ?? "none"}
              type='button'
              className={`${css.bgSwatch} ${bg ? "" : css.bgSwatchNone} ${background === bg ? css.bgSwatchActive : ""}`}
              style={bg ? { backgroundImage: `url(${BOARD_BACKGROUND_IMAGES[bg]})` } : undefined}
              onClick={() => setBackground(bg)}
              aria-label={bg ?? "No background"}
              aria-pressed={background === bg}
            >
              {!bg && <Icon name='icon-x' />}
            </button>
          ))}
        </div>
      </div>

      <button className={css.submit} type='submit' disabled={isLoading}>
        <span className={css.submitIcon}>
          <Icon name='icon-plus' />
        </span>
        {submitLabel}
      </button>
    </form>
  );
};

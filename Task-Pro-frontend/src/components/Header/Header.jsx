import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { Icon } from "../Icon/Icon.jsx";
import { selectUser } from "../../redux/auth/selectors.js";
import { updateTheme } from "../../redux/auth/operations.js";
import { EditProfileModal } from "../EditProfileModal/EditProfileModal.jsx";
import css from "./Header.module.css";

const THEMES = ["light", "violet", "dark"];

export const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleThemeSelect = (theme) => {
    dispatch(updateTheme(theme));
    setThemeMenuOpen(false);
  };

  return (
    <header className={css.header}>
      <button type='button' className={css.menuButton} onClick={onMenuClick} aria-label='Open menu'>
        <Icon name='icon-container-dark' />
      </button>

      <div className={css.themeDropdown}>
        <button
          type='button'
          className={css.themeButton}
          onClick={() => setThemeMenuOpen((prev) => !prev)}
        >
          <Icon name='icon-colors-dark' />
          <span>Theme</span>
          <Icon name='icon-arrow-circle-dark' className={css.chevronIcon} />
        </button>

        {themeMenuOpen && (
          <ul className={css.themeMenu}>
            {THEMES.map((theme) => (
              <li key={theme}>
                <button
                  type='button'
                  className={clsx(css.themeOption, user.theme === theme && css.themeOptionActive)}
                  onClick={() => handleThemeSelect(theme)}
                >
                  {theme[0].toUpperCase() + theme.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type='button' className={css.userButton} onClick={() => setProfileModalOpen(true)}>
        <span className={css.avatar}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name || "avatar"} className={css.avatarImage} />
          ) : (
            <Icon name='icon-plus-avatar-dark' className={css.avatarIcon} />
          )}
        </span>
        <span className={css.userName}>{user.name}</span>
      </button>

      {profileModalOpen && <EditProfileModal onClose={() => setProfileModalOpen(false)} />}
    </header>
  );
};

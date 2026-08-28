import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "../Icon/Icon.jsx";
import { EditProfileModal } from "../EditProfileModal/EditProfileModal.jsx";
import { updateTheme } from "../../redux/auth/operations.js";
import { selectTheme, selectUser } from "../../redux/auth/selectors.js";
import css from "./Header.module.css";

const THEMES = [
  { value: "light", label: "Light", icon: "icon-sun" },
  { value: "violet", label: "Violet", icon: "icon-star" },
  { value: "dark", label: "Dark", icon: "icon-loading" },
];

export const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeTheme = THEMES.find(({ value }) => value === theme) ?? THEMES[0];

  useEffect(() => {
    if (!isThemeOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isThemeOpen]);

  const handleThemeChange = async (value) => {
    const result = await dispatch(updateTheme(value));
    if (updateTheme.fulfilled.match(result)) setIsThemeOpen(false);
  };

  return (
    <header className={css.header}>
      <button type='button' className={css.menuButton} onClick={onMenuClick} aria-label='Toggle menu'>
        <Icon name='icon-menu' />
      </button>

      <div className={css.themeDropdown} ref={dropdownRef}>
        <button
          type='button'
          className={css.themeButton}
          onClick={() => setIsThemeOpen((prev) => !prev)}
          aria-expanded={isThemeOpen}
          aria-haspopup='menu'
        >
          <Icon name={activeTheme.icon} />
          <span>{activeTheme.label}</span>
          <Icon name='icon-chevron-down' className={css.chevronIcon} />
        </button>

        {isThemeOpen && (
          <ul className={css.themeMenu} role='menu'>
            {THEMES.map(({ value, label, icon }) => (
              <li key={value}>
                <button
                  type='button'
                  role='menuitem'
                  className={`${css.themeOption} ${theme === value ? css.themeOptionActive : ""}`}
                  onClick={() => handleThemeChange(value)}
                >
                  <Icon name={icon} />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type='button' className={css.userButton} onClick={() => setIsProfileOpen(true)}>
        <span className={css.avatar}>
          {user?.avatarURL ? (
            <img className={css.avatarImage} src={user.avatarURL} alt={`${user.name} profile`} />
          ) : (
            <Icon name='icon-user' className={css.avatarIcon} />
          )}
        </span>
        <span className={css.userName}>{user?.name || "User"}</span>
      </button>

      {isProfileOpen && <EditProfileModal onClose={() => setIsProfileOpen(false)} />}
    </header>
  );
};

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { Icon } from "../../components/Icon/Icon.jsx";
import { logout } from "../../redux/auth/operations.js";
import css from "./Sidebar.module.css";

// NOT: Board olusturma/duzenleme/Need Help modallari (CreateBoardModal,
// EditBoardModal, HelpModal) ve redux/boards henuz tamamlanmadigi icin
// bu butonlar simdilik guvenli bir sekilde no-op birakildi.
// Board ozelligini yazan arkadas bu TODO'lari doldurmali.

export const Sidebar = ({ boards = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/welcome");
  };

  return (
    <aside className={css.sidebar}>
      <div className={css.logo}>
        <Icon name='icon-icon-logo-violet' className={css.logoIcon} />
        <span>Task Pro</span>
      </div>

      <button type='button' className={css.createButton} onClick={() => setCreateModalOpen(true)}>
        <Icon name='icon-plus-create-violet' className={css.createIcon} />
        <span>Create new board</span>
      </button>

      <div className={css.sectionHeader}>
        <span className={css.sectionTitle}>My boards</span>
      </div>

      {boards.length === 0 ? (
        <p className={css.emptyText}>No boards yet</p>
      ) : (
        <ul className={css.list}>
          {boards.map((board) => (
            <li key={board._id} className={css.item}>
              <NavLink
                to={`/home/${board._id}`}
                className={({ isActive }) => clsx(css.link, isActive && css.itemActive)}
              >
                <Icon name='icon-hexagon-violet' className={css.linkIcon} />
                <span className={css.linkTitle}>{board.title}</span>
              </NavLink>
              <div className={css.itemActions}>
                <button type='button' className={css.iconButton} aria-label='Edit board'>
                  <Icon name='icon-pencil-violet' />
                </button>
                <button type='button' className={css.iconButton} aria-label='Delete board'>
                  <Icon name='icon-trash-violet' />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={css.footer}>
        <div className={css.helpCard}>
          <Icon name='icon-lightning-violet' className={css.helpIcon} />
          <p className={css.helpText}>If you need help with the Task Pro, check out our support</p>
          <button type='button' className={css.helpButton} onClick={() => setHelpModalOpen(true)}>
            Need help?
          </button>
        </div>

        <button type='button' className={css.footerButton} onClick={handleLogout}>
          <Icon name='icon-arrow-circle-violet' />
          <span>Log out</span>
        </button>
      </div>

      {/* TODO: CreateBoardModal ve HelpModal hazir olunca burada acilacak.
          Su an bu bilesenler bozuk/eksik oldugu icin bagli degil. */}
      {createModalOpen && (
        <p style={{ display: "none" }}>{/* CreateBoardModal buraya gelecek */}</p>
      )}
      {helpModalOpen && (
        <p style={{ display: "none" }}>{/* HelpModal buraya gelecek */}</p>
      )}
    </aside>
  );
};

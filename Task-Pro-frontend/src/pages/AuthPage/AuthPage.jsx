import { Navigate, NavLink, useParams } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import RegisterForm from "../../components/RegisterForm/RegisterForm.jsx";
import { Icon } from "../../components/Icon/Icon.jsx";
import clsx from "clsx";
import css from "./AuthPage.module.css";

const AuthPage = () => {
  const { id } = useParams();

  if (id !== "login" && id !== "register") {
    return <Navigate to='/auth/login' replace />;
  }

  const isLogin = id === "login";

  return (
    <div className={css.page}>
      <div className={css.card}>
        <div className={css.logo}>
          <Icon name='icon-logo' className={css.logoIcon} />
          <span>Task Pro</span>
        </div>

        <nav className={css.tabs}>
          <NavLink to='/auth/register' className={({ isActive }) => clsx(css.tab, isActive && css.tabActive)}>
            Registration
          </NavLink>
          <NavLink to='/auth/login' className={({ isActive }) => clsx(css.tab, isActive && css.tabActive)}>
            Log In
          </NavLink>
        </nav>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;

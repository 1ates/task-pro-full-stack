import { useParams, NavLink } from "react-router-dom";
import css from "./AuthPage.module.css";
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import RegisterForm from "../../components/RegisterForm/RegisterForm.jsx";

const AuthPage = () => {
  const { id } = useParams();
  const isLogin = id === "login";

  return (
    <div className={css.page}>
      <div className={css.card}>
        {/* Tabs */}
        <nav className={css.tabs}>
          <NavLink
            to="/auth/register"
            className={({ isActive }) =>
              `${css.tab} ${isActive ? css.tabActive : ""}`
            }
          >
            Registration
          </NavLink>
          <NavLink
            to="/auth/login"
            className={({ isActive }) =>
              `${css.tab} ${isActive ? css.tabActive : ""}`
            }
          >
            Log In
          </NavLink>
        </nav>

        {/* Form */}
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;

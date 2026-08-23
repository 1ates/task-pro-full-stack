import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Icon } from "../../components/Icon/Icon.jsx";
import { LoginForm } from "../../components/LoginForm/LoginForm.jsx";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm.jsx";
import css from "./AuthPage.module.css";

const AuthPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // /auth altinda gecersiz bir id gelirse (ornegin /auth/xyz) login'e yonlendir
  useEffect(() => {
    if (id !== "login" && id !== "register") {
      navigate("/auth/login", { replace: true });
    }
  }, [id, navigate]);

  const isLogin = id === "login";

  return (
    <div className={css.page}>
      <div className={css.card}>
        <div className={css.logo}>
          <Icon name='icon-icon-logo-violet' className={css.logoIcon} />
          <span>Task Pro</span>
        </div>

        <div className={css.tabs}>
          <button
            type='button'
            className={clsx(css.tab, isLogin && css.tabActive)}
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </button>
          <button
            type='button'
            className={clsx(css.tab, !isLogin && css.tabActive)}
            onClick={() => navigate("/auth/register")}
          >
            Registration
          </button>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;

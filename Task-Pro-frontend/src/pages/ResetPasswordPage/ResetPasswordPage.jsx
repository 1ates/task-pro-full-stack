import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordSchema } from "../../schemas/validationSchemas.js";
import { resetPassword } from "../../redux/auth/operations.js";
import { selectAuthLoading } from "../../redux/auth/selectors.js";
import { Icon } from "../../components/Icon/Icon.jsx";
import { PasswordField } from "../../components/PasswordField/PasswordField.jsx";
import css from "../AuthPage/AuthPage.module.css";
import formCss from "../../components/Public.module.css";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const isLoading = useSelector(selectAuthLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(resetPasswordSchema), mode: "onTouched" });

  const onSubmit = async ({ password }) => {
    if (!token) {
      toast.error("Reset link is invalid or incomplete.");
      return;
    }

    const result = await dispatch(resetPassword({ token, password }));
    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password reset successfully. You can now log in.");
      navigate("/auth/login", { replace: true });
    } else {
      toast.error(result.payload || "Unable to reset password");
    }
  };

  return (
    <div className={css.page}>
      <div className={css.card}>
        <div className={css.logo}>
          <Icon name='icon-logo' className={css.logoIcon} />
          <span>Task Pro</span>
        </div>

        <div>
          <h1 className={css.title}>Reset password</h1>
          <p className={css.description}>Choose a new password for your Task Pro account.</p>
        </div>

        {!token ? (
          <>
            <p className={formCss.error}>This reset link is invalid or missing its token.</p>
            <Link to='/auth/forgot-password' className={formCss.submit}>
              Request a new link
            </Link>
          </>
        ) : (
          <form className={formCss.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <PasswordField
              register={register}
              name='password'
              error={errors.password}
              placeholder='New password'
              autoComplete='new-password'
            />
            <PasswordField
              register={register}
              name='confirmPassword'
              error={errors.confirmPassword}
              placeholder='Confirm new password'
              autoComplete='new-password'
            />
            <button type='submit' className={formCss.submit} disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}

        <Link to='/auth/login' className={formCss.link}>
          Back to Log In
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

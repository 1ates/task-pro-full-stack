import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import clsx from "clsx";
import { forgotPasswordSchema } from "../../schemas/validationSchemas.js";
import { requestPasswordReset } from "../../redux/auth/operations.js";
import { selectAuthLoading } from "../../redux/auth/selectors.js";
import { Icon } from "../../components/Icon/Icon.jsx";
import css from "../AuthPage/AuthPage.module.css";
import formCss from "../../components/Public.module.css";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(forgotPasswordSchema), mode: "onTouched" });

  const onSubmit = async ({ email }) => {
    const result = await dispatch(requestPasswordReset(email));
    if (requestPasswordReset.fulfilled.match(result)) {
      toast.success("If the account exists, a reset email has been sent.");
      reset();
    } else {
      toast.error(result.payload || "Unable to send reset email");
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
          <h1 className={css.title}>Forgot password?</h1>
          <p className={css.description}>Enter your email address and we&apos;ll send you a link to reset your password.</p>
        </div>

        <form className={formCss.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={formCss.field}>
            <input
              type='email'
              placeholder='Email'
              autoComplete='email'
              className={clsx(formCss.input, errors.email && formCss.inputError)}
              {...register("email")}
            />
            {errors.email && <span className={formCss.error}>{errors.email.message}</span>}
          </div>
          <button type='submit' className={formCss.submit} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <Link to='/auth/login' className={formCss.link}>
          Back to Log In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

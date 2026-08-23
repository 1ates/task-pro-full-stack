import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import clsx from "clsx";
import { loginSchema } from "../../schemas/validationSchemas.js";
import { login } from "../../redux/auth/operations.js";
import { selectAuthLoading } from "../../redux/auth/selectors.js";
import { PasswordField } from "../PasswordField/PasswordField.jsx";
import css from "../Public.module.css";

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      navigate("/home");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.field}>
        <input
          type='email'
          placeholder='Email'
          className={clsx(css.input, errors.email && css.inputError)}
          {...register("email")}
        />
        {errors.email && <span className={css.error}>{errors.email.message}</span>}
      </div>

      <PasswordField register={register} name='password' error={errors.password} placeholder='Password' />

      <button type='submit' className={css.submit} disabled={isLoading}>
        Log In Now
      </button>
    </form>
  );
};

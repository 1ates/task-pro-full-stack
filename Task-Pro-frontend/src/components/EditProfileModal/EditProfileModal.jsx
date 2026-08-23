import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import clsx from "clsx";
import { Modal } from "../Modal/Modal.jsx";
import { Icon } from "../Icon/Icon.jsx";
import { PasswordField } from "../PasswordField/PasswordField.jsx";
import { profileSchema } from "../../schemas/validationSchemas.js";
import { updateProfile } from "../../redux/auth/operations.js";
import { selectUser, selectAuthLoading } from "../../redux/auth/selectors.js";
import modalCss from "../PublicModal.module.css";
import formCss from "../Public.module.css";
import css from "./EditProfileModal.module.css";

export const EditProfileModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      password: "",
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    const payload = { ...values };
    if (!payload.password) delete payload.password;
    if (avatarFile) payload.avatar = avatarFile;

    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
      onClose();
    } else {
      toast.error(result.payload || "Profile update failed");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className={modalCss.title}>Edit Profile</h2>

      <form className={formCss.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={css.avatarWrapper}>
            <button type='button' className={css.avatarButton} onClick={() => fileInputRef.current?.click()}>
              {avatarPreview ? (
                <img src={avatarPreview} alt='avatar' className={css.avatarImage} />
              ) : (
                <Icon name='icon-plus-avatar-dark' className={css.avatarIcon} />
              )}
              <span className={css.avatarOverlay}>
                <Icon name='icon-pencil-dark' />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className={css.fileInput}
              onChange={handleAvatarChange}
            />
          </div>

          <div className={formCss.field}>
            <input
              type='text'
              placeholder='Name'
              className={clsx(formCss.input, errors.name && formCss.inputError)}
              {...register("name")}
            />
            {errors.name && <span className={formCss.error}>{errors.name.message}</span>}
          </div>

          <div className={formCss.field}>
            <input
              type='email'
              placeholder='Email'
              className={clsx(formCss.input, errors.email && formCss.inputError)}
              {...register("email")}
            />
            {errors.email && <span className={formCss.error}>{errors.email.message}</span>}
          </div>

          <PasswordField register={register} name='password' error={errors.password} placeholder='New password (optional)' />

        <button type='submit' className={formCss.submit} disabled={isLoading}>
          Send
        </button>
      </form>
    </Modal>
  );
};

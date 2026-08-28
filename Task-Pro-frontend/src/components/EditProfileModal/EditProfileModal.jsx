import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal.jsx";
import { Icon } from "../Icon/Icon.jsx";
import { PasswordField } from "../PasswordField/PasswordField.jsx";
import { profileSchema } from "../../schemas/validationSchemas.js";
import { updateProfile } from "../../redux/auth/operations.js";
import { selectAuthLoading, selectUser } from "../../redux/auth/selectors.js";
import modalCss from "../PublicModal.module.css";
import formCss from "../Public.module.css";
import css from "./EditProfileModal.module.css";

export const EditProfileModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);
  const fileInputRef = useRef(null);
  const avatarPreviewUrlRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarURL || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  });

  useEffect(() => () => {
    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current);
    }
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar must be smaller than 5 MB.");
      return;
    }

    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    avatarPreviewUrlRef.current = previewUrl;
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("email", values.email.trim());

    if (values.password) formData.append("password", values.password);
    if (avatarFile) formData.append("avatar", avatarFile);

    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
      onClose();
    } else {
      toast.error(result.payload || "Failed to update profile");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className={modalCss.title}>Edit profile</h2>

      <div className={css.avatarWrapper}>
        <button
          type='button'
          className={css.avatarButton}
          onClick={() => fileInputRef.current?.click()}
          aria-label='Change profile photo'
        >
          {avatarPreview ? (
            <img className={css.avatarImage} src={avatarPreview} alt={`${user?.name || "User"} profile`} />
          ) : (
            <Icon name='icon-user' className={css.avatarIcon} />
          )}
          <span className={css.avatarOverlay}>
            <Icon name='icon-edit' />
          </span>
        </button>
        <input
          ref={fileInputRef}
          className={css.fileInput}
          type='file'
          accept='image/jpeg,image/png,image/webp'
          onChange={handleAvatarChange}
        />
      </div>

      <form className={modalCss.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={formCss.field}>
          <input
            className={`${formCss.input} ${errors.name ? formCss.inputError : ""}`}
            type='text'
            placeholder='Name'
            autoComplete='name'
            {...register("name")}
          />
          {errors.name && <span className={formCss.error}>{errors.name.message}</span>}
        </div>

        <div className={formCss.field}>
          <input
            className={`${formCss.input} ${errors.email ? formCss.inputError : ""}`}
            type='email'
            placeholder='Email'
            autoComplete='email'
            {...register("email")}
          />
          {errors.email && <span className={formCss.error}>{errors.email.message}</span>}
        </div>

        <PasswordField
          register={register}
          name='password'
          error={errors.password}
          placeholder='New password (optional)'
          autoComplete='new-password'
        />

        <button className={modalCss.submit} type='submit' disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>
    </Modal>
  );
};

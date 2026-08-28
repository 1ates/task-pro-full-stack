import * as yup from "yup";

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
const passwordRegexp = /^[a-zA-Z0-9!@#$%^&*()\-_=+]+$/;
const nameRegexp = /^[a-zA-Z0-9!@#$%^&*()\-_=+\s]+$/;

export const emailSchema = yup
  .string()
  .trim()
  .matches(emailRegexp, "Enter a valid email address")
  .required("Email is required");

export const passwordSchema = yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters")
  .matches(passwordRegexp, "Password may contain only letters, numbers and symbols, no spaces")
  .required("Password is required");

export const nameSchema = yup
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(32, "Name must be at most 32 characters")
  .matches(nameRegexp, "Name contains invalid characters")
  .required("Name is required");

export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = yup.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const profileSchema = yup.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema.notRequired().transform((value) => value || undefined),
});

export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});

export const resetPasswordSchema = yup.object({
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

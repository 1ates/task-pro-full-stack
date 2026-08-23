import * as yup from "yup";

export const cardSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(64, "Title must be at most 64 characters")
    .required("Title is required"),
  description: yup
    .string()
    .trim()
    .min(2, "Description must be at least 2 characters")
    .max(256, "Description must be at most 256 characters")
    .required("Description is required"),
  priority: yup
    .string()
    .oneOf(["without", "low", "medium", "high"], "Invalid priority")
    .required(),
  deadline: yup.date().nullable(),
});

export const columnSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(64, "Title must be at most 64 characters")
    .required("Title is required"),
});

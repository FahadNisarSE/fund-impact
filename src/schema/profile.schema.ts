import { z } from "zod";

export const profileSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z.string({
    required_error: "Email is required",
  }),
  dateOfBirth: z.date({
    required_error: "Date of Birth is required",
    invalid_type_error: "Date of Birth has invalid format.",
  }),
  image: z.string({
    required_error: "Image is required.",
  }),
  bio: z.string({
    required_error: "User Bio is required.",
  }),
});

export const profileSchemaApi = z.object({
  id: z.string({
    required_error: "user_id is required.",
  }),
  name: z.string({
    required_error: "Name is required",
  }),
  email: z.string({
    required_error: "Email is required",
  }),
  dateOfBirth: z
    .string({
      required_error: "Date of Birth is required",
    })
    .transform((str) => new Date(str)),
  image: z.string({
    required_error: "Image is required.",
  }),
  bio: z.string({
    required_error: "User Bio is required.",
  }),
});

export type TProfileSchema = z.infer<typeof profileSchema>;

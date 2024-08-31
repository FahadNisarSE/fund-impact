import { z } from "zod";

export const postClientSchema = z.object({
  image: z
    .instanceof(File, {
      message: "Please upload a file.",
    })
    .refine((file) => file, {
      message: "Please upload a single file.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png files are accepted.",
    })
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: "File size should be more than 5MB.",
    }),
  title: z
    .string({
      required_error: "The post title is required.",
    })
    .min(3, "The post title is required.")
    .max(255, "The title can be up to 255 characters long."),
  content: z
    .string({
      required_error: "Please provide a content for the project.",
    })
    .min(3, "The post content is required."),
});

export type TPostClientSchema = z.infer<typeof postClientSchema>;

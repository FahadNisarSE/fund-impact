import { z } from "zod";

export const projectBasicsSchema = z.object({
  image: z
    .instanceof(FileList)
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(files[0].type),
      {
        message: "Only .jpg and .png files are accepted.",
      }
    )
    .refine((files) => files[0].size <= 5 * 1024 * 1024, {
      message: "File size should be more than 5MB.",
    }),
  category: z.enum(
    [
      "Art",
      "Comics",
      "Crafts",
      "Fashion",
      "Film & Video",
      "Food",
      "Games",
      "Journalism",
      "Music",
      "Photography",
      "Mechanical",
      "Software & It",
      "Artificial Intelligence",
      "Green Energy",
    ],
    {
      required_error: "Please select a category for the project.",
      invalid_type_error: "Invalid category selected.",
    }
  ),
  title: z
    .string({
      required_error: "The project title is required.",
    })
    .max(255, "The title can be up to 255 characters long."),
  subtitle: z
    .string({
      required_error: "A subtitle is required for the project.",
    })
    .max(255, "The subtitle can be up to 255 characters long."),
  description: z.string({
    required_error: "Please provide a description for the project.",
  }),
});

export type TProjectBasicsSchema = z.infer<typeof projectBasicsSchema>;

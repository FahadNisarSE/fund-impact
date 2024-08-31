import { z } from "zod";

export const postServerSchema = z.object({
  image: z
    .string({
      required_error: "Image is required.",
    })
    .url({
      message: "Image is not a valid url",
    }),
  projectId: z.string({
    required_error: "Project Id is required.",
  }),
  title: z
    .string({
      required_error: "The project title is required.",
    })
    .max(255, "The title can be up to 255 characters long."),
  content: z.string({
    required_error: "Please provide a content for the project.",
  }),
});

export type TPostServerSchema = z.infer<typeof postServerSchema>;

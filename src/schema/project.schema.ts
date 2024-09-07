import { z } from "zod";

export enum projectCategory {
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
}

export const PROJECT_CATEGORIES = [
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
];

const goalAmountSchema = z.coerce
  .number({
    required_error: "Please provide a goal amount for the project",
  })
  .min(100, {
    message: "Project goal amount must be minimum of 100$",
  })
  .refine(
    (val) => {
      const [integerPart, fractionalPart] = val.toString().split(".");
      const precisionValid =
        integerPart.length + (fractionalPart?.length || 0) <= 10;
      const scaleValid = (fractionalPart?.length || 0) <= 2;
      return precisionValid && scaleValid;
    },
    {
      message:
        "Goal amount must have a maximum precision of 10 and a scale of 2.",
    }
  );

const currentAmountSchema = z.coerce
  .number({
    required_error: "Please provide a current amount for the project",
  })
  .refine(
    (val) => {
      const [integerPart, fractionalPart] = val.toString().split(".");
      const precisionValid =
        integerPart.length + (fractionalPart?.length || 0) <= 10;
      const scaleValid = (fractionalPart?.length || 0) <= 2;
      return precisionValid && scaleValid;
    },
    {
      message:
        "Current amount must have a maximum precision of 10 and a scale of 2.",
    }
  );

export const projectBasicsServerSchema = z.object({
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

export const projectFundSchema = z.object({
  stripeAccountId: z
    .string({
      required_error: "Please provide a stripe Account Id for the project.",
    })
    .max(255, "The Stripe Id can be up to 255 characters long."),
  goalAmount: goalAmountSchema,
  currentAmout: currentAmountSchema,
});

export type TProjectFundSchema = z.infer<typeof projectFundSchema>;

export const projectDurationSchema = z.object({
  launchDate: z
    .date({
      required_error: "Please provide a launch date for the project.",
    })
    .refine((val) => val >= new Date(), {
      message: "Launch date cannot be in the past.",
    }),
  projectDuration: z.coerce
    .number({
      required_error: "Please provide the project duration in number of days.",
    })
    .int("Project duration must be an integer.")
    .positive("Project duration must be a positive number."),
});

export const projectDurationServerSchema = z.object({
  launchDate: z.string({
    required_error: "Launch Date is required.",
  }),
  projectDuration: z.coerce
    .number({
      required_error: "Please provide the project duration in number of days.",
    })
    .int("Project duration must be an integer.")
    .positive("Project duration must be a positive number."),
});

export type TProjectDurationSchema = z.infer<typeof projectDurationSchema>;

export type TCompleteProjectPayload = {
  projectBasics: z.infer<typeof projectBasicsServerSchema>;
  projectFund: TProjectFundSchema;
  projectDuration: TProjectDurationSchema;
};

export const projectCommentSchema = z.object({
  projectId: z.string().uuid("Invalid UUID format."),
  comment: z.string().min(1, "Comment cannot be empty."),
});

export type TProjectCommentSchema = z.infer<typeof projectCommentSchema>;

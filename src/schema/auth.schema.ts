import { z } from "zod";

// Common error messages
const requiredErrorMessage = " is required.";
const invalidTypeErrorMessage = "Invalid format.";

export enum UserRole {
  Creator = "Creator",
  Supporter = "Supporter",
  Investor = "Investor",
}

export const userSignUpSchema = z.object({
  name: z.string({
    required_error: `Last name${requiredErrorMessage}`,
  }),
  email: z
    .string({
      required_error: `Email${requiredErrorMessage}`,
      invalid_type_error: invalidTypeErrorMessage,
    })
    .email(),
  password: z
    .string({
      required_error: `Password${requiredErrorMessage}`,
      invalid_type_error: "Password must have at least 8 characters.",
    })
    .min(8),
  userRole: z.nativeEnum(UserRole, {
    required_error: `User Role ${requiredErrorMessage}`,
  }),
});

export type TUserSignUpSchema = z.infer<typeof userSignUpSchema>;

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: `Email${requiredErrorMessage}`,
    })
    .email(),
  password: z
    .string({
      required_error: `Password${requiredErrorMessage}`,
      invalid_type_error: "Password must have at least 8 characters.",
    })
    .min(8),
});

export type TloginUserSchema = z.infer<typeof loginUserSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
});

export type TresetPasswordSchema = z.infer<typeof ResetPasswordSchema>;

export const NewPasswordSchema = z.object({
  password: z
    .string({
      required_error: `Password${requiredErrorMessage}`,
      invalid_type_error: "Password must have at least 8 characters.",
    })
    .min(8),
});

export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;

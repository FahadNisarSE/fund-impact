import { useMutation } from "@tanstack/react-query";

import { EmailVerification } from "@/action/auth/emailVerfication";

export default function useEmailVerification() {
  return useMutation({
    mutationKey: ["email_verification"],
    mutationFn: EmailVerification,
  });
}

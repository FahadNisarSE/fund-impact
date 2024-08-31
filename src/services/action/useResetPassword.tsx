import resetPassword from "@/action/auth/resetPassword";
import { useMutation } from "@tanstack/react-query";

export default function useResetPassword() {
  return useMutation({
    mutationKey: ["reset_password"],
    mutationFn: resetPassword,
  });
}

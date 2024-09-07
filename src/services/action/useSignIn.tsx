import { useMutation } from "@tanstack/react-query";

import { signInAction } from "@/action/auth/signIn";

export default function useSignIn() {
  return useMutation({
    mutationKey: ["sign_in"],
    mutationFn: signInAction,
  });
}

import { signInAction } from "@/action/auth/signIn";
import { TloginUserSchema } from "@/schema/auth.schema";
import { useMutation } from "@tanstack/react-query";

async function signIn(data: TloginUserSchema) {
  const result = await signInAction(data);

  if (result.error) {
    throw new Error(result.error);
  } else return result.success;
}

export default function useSignIn() {
  return useMutation({
    mutationKey: ["sign_in"],
    mutationFn: signIn,
  });
}

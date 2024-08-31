import { signUp } from "@/action/auth/signUp";
import { useMutation } from "@tanstack/react-query";

export default function useSignUp () {
    return useMutation({
        mutationKey: ["sign_up"],
        mutationFn: signUp
    })
}
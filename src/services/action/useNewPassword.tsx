import { newPassword } from "@/action/auth/newPassword"
import { useMutation } from "@tanstack/react-query"

export default function useNewPassword () {
    return useMutation({
        mutationKey: ['new_password'],
        mutationFn: newPassword
    })
}
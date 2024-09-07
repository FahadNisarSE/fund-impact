import { AddSupport } from "@/action/support/support";
import { useMutation } from "@tanstack/react-query";

export default function useSupportProject() {
    return useMutation({
        mutationKey: ['support_project'],
        mutationFn: AddSupport
    })
}
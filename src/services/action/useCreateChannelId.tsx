import { createChannelId } from "@/action/stream/streamAuthToken";
import { useMutation, useMutationState } from "@tanstack/react-query";

export default function useCreateChannelId() {
  return useMutation({
    mutationKey: ["use_create_channel_id"],
    mutationFn: createChannelId,
  });
}

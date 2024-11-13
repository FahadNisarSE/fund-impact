import { useMutation } from "@tanstack/react-query";

export default function useCreateChannelId() {
  return useMutation({
    mutationKey: ["use_create_channel_id"],
    mutationFn: async ({
      userId1,
      userId2,
      username,
    }: {
      userId1: string;
      userId2: string;
      username: string;
    }) => {
      const response = await fetch("/api/chat/create-channel-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId1, userId2, username }),
      });

      if (!response.ok) {
        throw new Error("Failed to create or fetch channel ID");
      }

      const data = await response.json();

      console.log("REsponse from create channel id: ", data);

      return data.channelId as string;
    },
  });
}

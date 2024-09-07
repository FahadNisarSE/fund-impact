import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { queryClient } from "@/utils/Providers";
import { postComments } from "../../../db/types";

export async function postComment({
  comment,
  postId,
}: {
  comment: string;
  postId: string;
}) {
  const response = await fetch("/api/post/postComment", {
    method: "POST",
    body: JSON.stringify({
      comment,
      postId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data as postComments;
}

export default function usePostComment() {
  const session = useSession();
  return useMutation({
    mutationKey: ["post_comments"],
    mutationFn: postComment,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: ["get_post_comments", newComment.postId],
      });

      const previousComments = queryClient.getQueryData([
        "get_post_comments",
        newComment.postId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["get_post_comments", newComment.postId],
        (old: any) => [
          {
            post_comments: {
              commentId: Date.now(),
              commentText: newComment.comment,
              createdAt: Date.now(),
            },
            user: {
              name: session.data?.user.name,
              image: session.data?.user.image,
            },
          },
          ...(old || []),
        ]
      );

      return { previousComments };
    },
    onError: (error, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["get_post_comments", variables.postId],
          context.previousComments
        );
      }
      toast.error("Error!", {
        description: error.message ?? "Something went wrong. Please try again.",
        action: {
          label: "Close",
          onClick: () => toast.dismiss("PROJECT_ERROR"),
        },
        duration: 10000,
        id: "PROJECT_ERROR",
      });
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get_post_comments", data?.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get_post_comments", data?.postId],
      });
    },
  });
}

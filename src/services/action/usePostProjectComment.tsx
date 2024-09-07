import { queryClient } from "@/utils/Providers";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { comments } from "../../../db/types";
import { useSession } from "next-auth/react";

export async function postProjectComment({
  comment,
  projectId,
}: {
  comment: string;
  projectId: string;
}) {
  const response = await fetch("/api/project/postComment", {
    method: "POST",
    body: JSON.stringify({
      comment,
      projectId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data as comments;
}

export default function usePostProjectComment() {
  const session = useSession();
  return useMutation({
    mutationKey: ["post_project_comment"],
    mutationFn: postProjectComment,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: ["get_project_comments", newComment.projectId],
      });

      const previousComments = queryClient.getQueryData([
        "get_project_comments",
        newComment.projectId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["get_project_comments", newComment.projectId],
        (old: any) => [
          ...(old || []),
          {
            comments: {
              commentId: Date.now(),
              commentText: newComment.comment,
              createdAt: Date.now(),
            },
            user: {
              name: session.data?.user.name,
              image: session.data?.user.image,
            },
          },
        ]
      );

      return { previousComments };
    },
    onError: (error, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["getvariablesproject_comments", variables.projectId],
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
        queryKey: ["get_project_comments", data?.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get_project_likes_and_comments", data?.projectId],
      });
    },
  });
}

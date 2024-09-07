import { queryClient } from "@/utils/Providers";
import { useMutation } from "@tanstack/react-query";

export async function likePost({ postId }: { postId: string }) {
  const response = await fetch("/api/post/likePost", {
    method: "POST",
    body: JSON.stringify({
      postId: postId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data as "unliked" | "liked";
}

export default function useLikePost() {
  return useMutation({
    mutationFn: likePost,
    mutationKey: ["like_postId"],
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["get_project_likes_and_comments", variables.postId],
      });

      const previousData = queryClient.getQueryData([
        "get_post_likes_and_comments",
        variables.postId,
      ]);

      queryClient.setQueryData(
        ["get_post_likes_and_comments", variables.postId],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            likes: oldData.isLiked ? oldData.likes - 1 : oldData.likes + 1,
            isLiked: !oldData.isLiked,
          };
        }
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["get_post_likes_and_comments", variables.postId],
          context.previousData
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get_post_likes_and_comments", variables.postId],
      });
    },
  });
}

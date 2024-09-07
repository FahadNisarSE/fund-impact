import { queryClient } from "@/utils/Providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function likeProject({ projectId }: { projectId: string }) {
  const response = await fetch("/api/project/likeProject", {
    method: "POST",
    body: JSON.stringify({
      projectId: projectId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data as "unliked" | "liked";
}

export default function useLikeProject() {
  return useMutation({
    mutationFn: likeProject,
    mutationKey: ["like_project"],
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["get_project_likes_and_comments", variables.projectId],
      });

      const previousData = queryClient.getQueryData([
        "get_project_likes_and_comments",
        variables.projectId,
      ]);

      queryClient.setQueryData(
        ["get_project_likes_and_comments", variables.projectId],
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
          ["get_project_likes_and_comments", variables.projectId],
          context.previousData
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get_project_likes_and_comments", variables.projectId],
      });
    },
  });
}

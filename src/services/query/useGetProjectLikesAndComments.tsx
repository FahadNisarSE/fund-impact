import { useQuery } from "@tanstack/react-query";

export async function getProjectLikesAndComments(projectId: string) {
  const response = await fetch(
    `/api/project/likeAndComments?projectId=${projectId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Something went wrong.");
  }

  return data.data as {
    likes: number;
    comments: number;
    isLiked: boolean;
  };
}

export default function useGetProjectLikesAndComments(projectId: string) {
  return useQuery({
    queryKey: ["get_project_likes_and_comments", projectId],
    queryFn: () => getProjectLikesAndComments(projectId),
    refetchInterval: 30000,
  });
}

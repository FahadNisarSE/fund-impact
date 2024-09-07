import { comments, user } from "@/../../db/types";
import { useQuery } from "@tanstack/react-query";

export async function getProjectComments(projectId: string) {
  const response = await fetch(
    `/api/project/projectCommments?projectId=${projectId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Something went wrong.");
  }

  return data.data as {
    user: user;
    comments: comments;
  }[];
}

export default function useGetProjectComments(projectId: string) {
  return useQuery({
    queryKey: ["get_project_comments", projectId],
    queryFn: () => getProjectComments(projectId),
    refetchInterval: 30000,
  });
}

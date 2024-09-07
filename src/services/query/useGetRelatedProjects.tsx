import { useQuery } from "@tanstack/react-query";
import { project } from "../../../db/types";

async function getRelatedProjects(projectId: string) {
  const response = await fetch(
    `/api/project/related?limit=5&projectId=${projectId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Something went wrong.");
  }

  return data.data as project[];
}

export default function useGetRelatedProjects(projectId: string) {
  return useQuery({
    queryKey: ["get_related_project", projectId],
    queryFn: () => getRelatedProjects(projectId),
  });
}

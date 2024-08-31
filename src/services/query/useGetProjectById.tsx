import { project } from "@/../../db/types";
import { useQuery } from "@tanstack/react-query";

export async function getProjectById(projectId: string) {
  if (!projectId || typeof projectId !== "string")
    throw new Error("Invalid Project Id passed.");
  const response = await fetch(`/api/project/${projectId}`, {
    method: "GET",
    next: {
      revalidate: 10,
    },
  });

  const data = await response.json();

  if (response.ok) {
    return data.data as project;
  }

  throw new Error(data.message ?? "Something went wrong.");
}

export default function useGetProjectById(projectId: string) {
  return useQuery({
    queryKey: ["get_project_by_id", projectId],
    queryFn: () => getProjectById(projectId),
  });
}
import { useQuery } from "@tanstack/react-query";

export interface ProjectSupports {
  supportId: string;
  amount: string;
  verified: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userName: string | null;
  userEmail: string;
  userImage: string | null;
  userRole: "Creator" | "Supporter";
}
[];

export async function getSuuportForProject(projectId: string) {
  if (!projectId || typeof projectId !== "string")
    throw new Error("Invalid Project Id passed.");
  const response = await fetch(`/api/support/project/${projectId}`, {
    method: "GET",
    next: {
      revalidate: 0,
    },
  });

  const data = await response.json();

  if (response.ok) {
    return data.data as ProjectSupports[];
  }

  throw new Error(data.message ?? "Something went wrong.");
}

export default function useGetSupportForProject(projectId: string) {
  return useQuery({
    queryKey: ["get_support_for_project", projectId],
    queryFn: () => getSuuportForProject(projectId),
  });
}

import { useQuery } from "@tanstack/react-query";

export interface UserSupports {
  supportId: string;
  amount: string;
  verified: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  projectId: string;
  projectTitle: string;
  projectImage: string;
  projectCategory:
    | "Art"
    | "Comics"
    | "Crafts"
    | "Fashion"
    | "Film & Video"
    | "Food"
    | "Games"
    | "Journalism"
    | "Music"
    | "Photography"
    | "Mechanical"
    | "Software & It"
    | "Artificial Intelligence"
    | "Green Energy";
  projectDescription: string;
  goalAmount: string;
  currentAmount: string | null;
  launchDate: string;
}
[];

export async function getSupportByUserId(userId: string | undefined) {
  if (!userId || typeof userId !== "string")
    throw new Error("Invalid User Id passed.");

  console.log("Thre is a user id: ", userId);
  const response = await fetch(`/api/support/user/${userId}`, {
    method: "GET",
    next: {
      revalidate: 0,
    },
  });

  const data = await response.json();

  if (response.ok) {
    return data.data as UserSupports[];
  }

  throw new Error(data.message ?? "Something went wrong.");
}

export default function useGetSupportByUserId(userId: string | undefined) {
  return useQuery({
    queryKey: ["get_support_by_user_id", userId],
    queryFn: () => getSupportByUserId(userId),
  });
}

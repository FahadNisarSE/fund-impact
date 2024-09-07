import { useQuery } from "@tanstack/react-query";
import { posts } from "../../../db/types";

export async function getRelatedPosts(postId: string) {
  const response = await fetch(`/api/post/related?limit=5&postId=${postId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Something went wrong.");
  }

  return data.data as posts[];
}

export default function useGetRelatedPosts(postId: string) {
  return useQuery({
    queryKey: ["get_related_posts", postId],
    queryFn: () => getRelatedPosts(postId),
  });
}

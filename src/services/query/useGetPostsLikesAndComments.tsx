import { useQuery } from "@tanstack/react-query";

export async function getPostLikesAndComments(postId: string) {
  const response = await fetch(
    `/api/post/getLikesAndComments?postId=${postId}`
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

export default function useGetPostLikesAndComments(postId: string) {
  return useQuery({
    queryKey: ["get_post_likes_and_comments", postId],
    queryFn: () => getPostLikesAndComments(postId),
    refetchInterval: 30000,
  });
}

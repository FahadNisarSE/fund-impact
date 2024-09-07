import { comments, postComments, user } from "@/../../db/types";
import { useQuery } from "@tanstack/react-query";

export async function getPostComments(postId: string) {
  const response = await fetch(
    `/api/post/getPostComments?postId=${postId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Something went wrong.");
  }

  return data.data as {
    user: user;
    post_comments: postComments;
  }[];
}

export default function useGetPostComments(postId: string) {
  return useQuery({
    queryKey: ["get_post_comments", postId],
    queryFn: () => getPostComments(postId),
    refetchInterval: 30000,
  });
}

"use client";

import { useSession } from "next-auth/react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { IoIosWarning } from "react-icons/io";
import { MdOutlineComment } from "react-icons/md";

import useLikePost from "@/services/action/useLikePost";
import useGetPostLikesAndComments from "@/services/query/useGetPostsLikesAndComments";
import { Skeleton } from "../ui/skeleton";

export default function PostLikeAndComment({ postId }: { postId: string }) {
  const { isLoading, error, data } = useGetPostLikesAndComments(postId);
  const { mutate: likeProject, isPending } = useLikePost();

  if (isLoading) {
    return (
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex flex-col items-center p-3 rounded">
          <BiLike className="w-6 h-6" />
          <Skeleton className="w-16 h-4 mt-2 rounded" />
        </div>
        <div className="flex flex-col items-center p-3 rounded">
          <MdOutlineComment className="w-6 h-6" />
          <Skeleton className="w-16 h-4 mt-2 rounded" />
        </div>
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="flex items-center gap-4 text-destructive">
        <IoIosWarning className="w-16 h-16" />
        <p className="text-base">{error?.message ?? "Somehting went wrong!"}</p>
      </div>
    );
  }

  return (
    <section className="flex items-center justify-between gap-4 w-full">
      <button
        onClick={() => likeProject({ postId })}
        disabled={isPending}
        className={`flex flex-col gap-1 w-36 border ${
          data.isLiked ? "border-sky-500" : "border-gray-300"
        } hover:border-sky-500 transition-colors cursor-pointer group rounded-xl py-2 px-5 items-center p-3`}
      >
        {data?.isLiked ? (
          <>
            <BiSolidLike className="w-6 h-6 text-sky-500 " />
            <span className="block text-center text-sm text-sky-500">
              {data.likes} Likes
            </span>
          </>
        ) : (
          <>
            <BiLike className="w-6 h-6 group-hover:text-sky-500 transition-colors" />
            <span className="block text-gray-700 text-center text-sm group-hover:text-sky-500 transition-colors">
              {data.likes} Likes
            </span>
          </>
        )}
      </button>

      <div className="flex flex-col gap-1 w-36 border border-gray-300 rounded-xl py-2 px-5 items-center p-3">
        <MdOutlineComment className="w-5 h-5" />
        <span className="block text-gray-700 text-center text-sm">
          {data.comments} Comments
        </span>
      </div>
    </section>
  );
}

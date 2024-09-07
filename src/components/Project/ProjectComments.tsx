"use client";

import Image from "next/image";
import { useRef } from "react";
import { IoIosWarning } from "react-icons/io";

import usePostProjectComment from "@/services/action/usePostProjectComment";
import useGetProjectComments from "@/services/query/useGetProjectComments";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export default function ProjectComments({ projectId }: { projectId: string }) {
  const { data, isLoading, error } = useGetProjectComments(projectId);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = usePostProjectComment();

  return (
    <section className="border border-gray-300 p-4 rounded-lg flex flex-col gap-4 h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      <div className="flex flex-col gap-4 h-full overflow-y-auto">
        {isLoading ? (
          <>
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="w-full">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
                <Skeleton className="h-3 w-1/2 mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="w-full">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
                <Skeleton className="h-3 w-1/2 mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="w-full">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
                <Skeleton className="h-3 w-1/2 mt-1" />
              </div>
            </div>
          </>
        ) : error || !data ? (
          <div className="flex items-center gap-4 text-destructive">
            <IoIosWarning className="w-16 h-16" />
            <p className="text-base">
              {error?.message ?? "Somehting went wrong!"}
            </p>
          </div>
        ) : data?.length === 0 ? (
          <>
            <div className="flex flex-col items-center gap-5">
              <Image
                src={"/no_comment.png"}
                className="w-32 object-contain"
                width={200}
                height={200}
                alt="no comments"
              />
              <h3>Be the first to comment!</h3>
            </div>
          </>
        ) : (
          data.map((comment) => (
            <div
              className="flex flex-row gap-4"
              key={comment.comments.commentId}
            >
              <Image
                src={comment.user.image ?? "/user.png"}
                alt={comment.user.name ?? "user-name"}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div>
                <div className="space-y-2 bg-wheat_white px-4 py-2 rounded-xl min-w-[250px] max-w-full">
                  <h5 className="font-semibold text-sm">{comment.user.name}</h5>
                  <div className="text-gray-700 text-sm">
                    {comment.comments.commentText}
                  </div>
                </div>
                <div className="mt-1 text-gray-700 ml-auto text-xs text-right">
                  {comment.comments.createdAt &&
                    new Date(comment.comments.createdAt).toDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-row items-stretch gap-2 mt-auto">
        <Input
          ref={inputRef}
          placeholder="Type a comment"
          className="py-3 rounded-xl h-auto"
        />
        <Button
          disabled={isPending}
          onClick={() => {
            if (inputRef.current?.value) {
              const comment = inputRef.current?.value;

              if (!comment?.trim()) return;

              mutate(
                {
                  comment: inputRef.current.value,
                  projectId,
                },
                {
                  onSuccess: () => {
                    // @ts-ignore
                    inputRef.current.value = "";
                  },
                }
              );
            }
          }}
          className="h-full rounded-xl"
        >
          POST
        </Button>
      </div>
    </section>
  );
}

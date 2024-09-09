"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

import { posts, user } from "@/../../db/types";
import Loader from "@/components/Loader";
import PostLikesAndComments from "@/components/PostFeed/PostLikesAndComment";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function getLatestPosts(limit = 5, page: number) {
  const response = await fetch(
    `/api/post/getLatestPosts?limit=${limit}&page=${page}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Something went wrong. Please try again.");
  }

  return data.data as {
    posts: posts;
    user: user;
  }[];
}

export default function ProjectFeed() {
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["latest_post_feed"],
    queryFn: ({ pageParam }) => getLatestPosts(5, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 5) return undefined;
      return allPages.length + 1;
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading)
    return (
      <main className={"min-h-screen mx-auto p-8 pt-28 max-w-3xl"}>
        <div className="border rounded-3xl p-5">
          <section className="flex items-center gap-5">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-40 h-5" />
              <Skeleton className="w-32 h-4" />
            </div>
          </section>

          <section className="space-y-3 mt-8">
            <Skeleton className="w-48 h-5" />
            <div className="space-y-2">
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </section>

          <section className="mt-8">
            <Skeleton className="w-full h-[40svh]" />
          </section>

          <section className="mt-8 flex-row flex justify-between gap-5">
            <Skeleton className="w-24 h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-24 h-16" />
          </section>
        </div>
      </main>
    );

  if (error || !data) {
    return (
      <main
        className={
          "min-h-screen mx-auto p-8 pt-28 max-w-3xl flex flex-col items-center justify-center gap-5"
        }
      >
        <img src="/error.png" alt="error" className="w-1/2 object-contain" />
        <h3 className="text-center text-gray-600 text-3xl font-semibold">
          {error?.message ?? "No project found."}
        </h3>
        <Button onClick={() => refetch()}>Try Again</Button>
      </main>
    );
  }

  if (!data.pages.length) {
    return (
      <main
        className={
          "min-h-screen mx-auto p-8 pt-28 max-w-3xl flex flex-col items-center justify-center gap-5"
        }
      >
        <img
          src="/no-result.svg"
          alt="error"
          className="w-1/2 object-contain"
        />
        <h3 className="text-center text-gray-600 text-3xl font-semibold">
          "No Project Found!"
        </h3>
        <Button>Refresh</Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen mx-auto flex flex-col gap-8 p-8 pt-28 max-w-3xl">
      {data.pages.map((page, postIndex) => (
        <section key={postIndex} className="flex flex-col gap-8">
          {page.map((post) => (
            <div
              className="p-5 border rounded-3xl flex flex-col gap-5"
              key={post.posts.postId}
            >
              <div className="flex items-center gap-5">
                <Image
                  src={post.user.image!}
                  alt={post.user.name!}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-pretty text-gray-800">
                    {post.user.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(post.posts.createdAt!).toLocaleDateString()} |{" "}
                    {new Date(post.posts.createdAt!).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-balance">
                  {post.posts.title}
                </h2>

                <p className="text-gray-600 text-pretty">
                  {post.posts.content}
                </p>
              </div>

              <div className="w-full min-h-[40svh] max-h-[40svh] rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={post.posts.image}
                  alt={post.posts.title}
                  width={500}
                  height={500}
                  className="w-full min-h-[40svh] max-h-[40svh] object-center object-cover"
                />
              </div>

              <PostLikesAndComments postId={post.posts.postId!} />
            </div>
          ))}
        </section>
      ))}

      {isFetchingNextPage ? (
        <div className="w-full flex flex-col items-center gap-5">
          <Loader className="w-16 text-primary h-16 duration-700" />
          <h3 className="text-center text-lg font-semibold text-gray-700">
            Loading! Please wait.
          </h3>
        </div>
      ) : null}

      {!hasNextPage && (
        <div className="w-full flex flex-col items-center gap-5">
          <IoCheckmarkDoneCircleSharp className="w-20 text-primary h-20" />
          <h3 className="text-center text-lg font-semibold text-gray-700">
            You are all caught up!
          </h3>
        </div>
      )}
    </main>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { posts } from "../../../db/types";

export default function LatestPosts({ payload }: { payload: posts[] }) {
  const { data, isLoading, error } = useQuery<posts[]>({
    queryFn: async () => {
      const response = await fetch("/api/post/latest?limit=10");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to fetch latest projects");
      }
      return data.data as posts[];
    },
    queryKey: ["get_latest_posts"],
    initialData: payload,
  });

  if (isLoading) <h1>Loading</h1>;

  if (error) <h1>{error.message ?? "Something went wrong."}</h1>;

  return (
    <Carousel>
      <CarouselContent>
        {data &&
          data.map((post) => (
            <CarouselItem className="basis-1/3" key={post.postId}>
              <div className="rounded-2xl overflow-hidden group relative select-none">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={500}
                  height={500}
                  className="h-[60svh] object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-transparent/30 flex flex-col justify-end gap-1 p-6">
                  <h5 className="text-primary font-semibold text-sm mb-2">
                    {post.createdAt && new Date(post.createdAt).toDateString()}
                  </h5>
                  <h3 className="text-white text-3xl text-balance font-bold mb-auto">
                    {post.title}
                  </h3>
                  <Link
                    href={`/post/${post.postId}`}
                    className="flex items-center gap-2 mt-4 bg-white group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow rounded-full px-5 py-3 w-fit"
                  >
                    View Detail <FaArrowRightLong />
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

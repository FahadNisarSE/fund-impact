"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";

import { project } from "../../../db/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export default function LatestProject({ payload }: { payload: project[] }) {
  const { data, isLoading, isError } = useQuery<project[]>({
    queryFn: async () => {
      const response = await fetch("/api/project/latest?limit=10");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to fetch latest projects");
      }
      return data.data as project[];
    },
    queryKey: ["get_latest_projects"],
    initialData: payload,
  });

  return (
    <Carousel>
      <CarouselContent>
        {data.map((project) => (
          <CarouselItem className="basis-1/3">
            <div className="rounded-2xl overflow-hidden group relative select-none">
              <Image
                src={project.image}
                alt={project.title}
                width={500}
                height={500}
                className="h-[60svh] object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-transparent/30 flex flex-col justify-end gap-1 p-6">
                <h5 className="text-primary font-semibold text-sm mb-2">
                  {project.subtitle}
                </h5>
                <h3 className="text-white text-3xl text-balance font-bold mb-auto">
                  {project.title}
                </h3>
                <Link
                  href={`/project/${project.projectId}`}
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

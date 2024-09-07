"use client";

import Image from "next/image";
import { MdArrowOutward } from "react-icons/md";

import useGetRelatedProjects from "@/services/query/useGetRelatedProjects";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export default function RelatedProjects({ projectId }: { projectId: string }) {
  const { isLoading, data, error } = useGetRelatedProjects(projectId);

  if (isLoading) {
    return (
      <>
        <div className="w-full h-fit grid gap-3 mt-5">
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-[60%] h-6" />
          <Skeleton className="w-[80%] h-4" />
        </div>
        <div className="w-full h-fit grid gap-3 mt-5">
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-[60%] h-6" />
          <Skeleton className="w-[80%] h-4" />
        </div>
      </>
    );
  }

  if (error || !data) {
    return <></>;
  }

  return (
    <>
      {data?.map((project) => (
        <div
          className="w-full h-fit grid gap-1 mt-5 relative group"
          key={project.projectId}
        >
          <Image
            src={project.image}
            alt={project.title}
            width={200}
            height={200}
            className="w-full h-40 rounded-xl object-cover object-center"
          />
          <Link
            href={`/project/${project?.projectId}`}
            className="flex items-center gap-2 bg-white rounded-3xl text-sm absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity duration-200 px-3 py-2 w-fit"
          >
            View more <MdArrowOutward />
          </Link>
          <h4 className="mt-2">{project.title}</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {project.subtitle}
          </p>
        </div>
      ))}
    </>
  );
}

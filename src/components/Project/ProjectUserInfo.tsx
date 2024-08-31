"use client";

import { IoIosWarning } from "react-icons/io";
import Image from "next/image";

import { useGetUserById } from "@/services/query/useGetUserById";
import { Skeleton } from "../ui/skeleton";

export default function ProjectUserInfo({ userId }: { userId: string }) {
  const { data, isLoading, error } = useGetUserById(userId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div>
          <Skeleton className="w-48 h-5 rounded-md" />
          <Skeleton className="w-40 h-4 rounded-md mt-2" />
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
    <div className="flex items-center gap-4">
      <Image
        src={data.image!}
        width={56}
        height={56}
        alt={data.name ?? "user image"}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h3 className="text-lg font-semibold">{data.name}</h3>
        <p className="text-sm text-gray-700">{data.userRole}</p>
      </div>
    </div>
  );
}

"use client";

import { userSupportColumns } from "@/components/Supports/columns";
import { DataTable } from "@/components/Supports/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useGetSupportByUserId from "@/services/query/useGetSupportByUserId";

import { useSession } from "next-auth/react";

export default function Supported() {
  const session = useSession();

  const { data, isLoading, error, refetch } = useGetSupportByUserId(
    session.data?.user.id
  );

  if (isLoading) {
    return (
      <main className={"min-h-screen mx-auto p-8 pt-28 max-w-5xl"}>
        <div className="border rounded-3xl p-5">
          <section className="flex items-center gap-5">
            <Skeleton className="w-full h-14 rounded-full" />
          </section>

          <section className="space-y-3 mt-8">
            <Skeleton className="w-full h-24" />
            <div className="space-y-2">
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main
        className={
          "min-h-screen mx-auto p-8 pt-28 flex flex-col items-center justify-center gap-5 max-w-5xl"
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

  return (
    <main className="min-h-screen mx-auto flex flex-col gap-8 p-8 pt-28 max-w-5xl">
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Project supported by you
        </h3>
        <DataTable
          columns={userSupportColumns}
          data={data}
          deleteRow={async (param: string) => {}}
          loading={false}
        />
      </div>
    </main>
  );
}

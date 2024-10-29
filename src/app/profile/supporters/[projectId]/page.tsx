"use client";

import { projectSupportedColumns } from "@/components/Supported/columns";
import { DataTable } from "@/components/Supported/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useGetSupportForProject from "@/services/query/useGetSupportForProject";

export default function page({ params }: { params: { projectId: string } }) {
  const { data, isLoading, error, refetch } = useGetSupportForProject(
    params.projectId
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
          Project Supporters
        </h3>
        <DataTable
          columns={projectSupportedColumns}
          data={data}
          deleteRow={async (param: string) => {}}
          loading={false}
        />
      </div>
    </main>
  );
}

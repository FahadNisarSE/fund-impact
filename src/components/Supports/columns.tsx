import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/Datatable/DataTableColumnHeader";
import { UserSupports } from "@/services/query/useGetSupportByUserId";
import Image from "next/image";
import Link from "next/link";

export const userSupportColumns: ColumnDef<UserSupports>[] = [
  {
    accessorKey: "projectImage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const singleSupport = row.original;

      return (
        <Link href={`/project/${singleSupport.projectId}`}>
          <Image
            src={singleSupport.projectImage}
            alt={singleSupport.projectTitle}
            width={100}
            height={100}
            className="aspect-square rounded object-cover"
          />
        </Link>
      );
    },
  },
  {
    accessorKey: "projectTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" />
    ),
  },
  {
    accessorKey: "projectCategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Category" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Support Amount" />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const support = row.original;

      return support.updatedAt
        ? new Date(support.updatedAt).toLocaleDateString()
        : support.updatedAt;
    },
  },
];

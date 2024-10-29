import { ColumnDef } from "@tanstack/react-table";
import { FiUser } from "react-icons/fi";

import { DataTableColumnHeader } from "@/components/Datatable/DataTableColumnHeader";
import { ProjectSupports } from "@/services/query/useGetSupportForProject";
import Image from "next/image";

export const projectSupportedColumns: ColumnDef<ProjectSupports>[] = [
  {
    accessorKey: "userImage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const singleSupport = row.original;

      return singleSupport.userImage ? (
        <Image
          src={singleSupport.userImage}
          alt={singleSupport.userName ?? "Support User"}
          width={100}
          height={100}
          className="aspect-square rounded object-cover"
        />
      ) : (
        <FiUser className="overflow-hidden rounded bg-slate-600 w-24 h-24 text-white text-primary" />
      );
    },
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "userEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Email" />
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

"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BulkLogType = {
  createdAt: string;
  material?: string;
  status: "Success" | "Failed";
  weight?: string;
  req?: string;
  lane?: string;
  fare?: string;
  expiresAt?: string;
  total: string;
  active: string;
};

export const columns: ColumnDef<BulkLogType>[] = [
  {
    accessorKey: "createdAt",
    header: "Upload Time",
    cell: ({ getValue }) =>
      dayjs(getValue<string>()).format("DD/MM/YYYY hh:mm A"),
  },
  {
    accessorKey: "fileName",
    header: "File Name",
  },
  {
    accessorKey: "totalCount",
    header: "Total records",
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  // }
];

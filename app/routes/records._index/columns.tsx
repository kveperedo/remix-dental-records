import { Link } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";

export type Record = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Record>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const recordId = row.original.id;

      return (
        <Link className="hover:underline" prefetch="intent" to={recordId}>
          {row.getValue("name")}
        </Link>
      );
    },
    enableSorting: true,
  },
];

import type { Transaction } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { SHORT_DATE_FORMAT } from "~/constants";

type TransactionType = Omit<Transaction, "date" | "createdAt" | "updatedAt"> & {
  date: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<TransactionType>[] = [
  {
    accessorKey: "date",
    header: "Date",
    size: 100,
    cell: ({ row }) => {
      const { date } = row.original;

      return format(new Date(date), SHORT_DATE_FORMAT);
    },
  },
  {
    accessorKey: "tooth",
    header: "Tooth",
    size: 200,
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 300,
    cell: ({ row }) => {
      const { description } = row.original;

      return <span className="whitespace-pre">{description}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 100,
    cell: ({ row }) => {
      const { amount } = row.original;

      return `₱${amount.toFixed(2)}`;
    },
  },
];

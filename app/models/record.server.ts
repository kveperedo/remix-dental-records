import { prisma } from "~/db.server";
import type { Record as RecordType } from "@prisma/client";
import type { SortingState } from "@tanstack/react-table";

export const RECORDS_PER_PAGE = 15;

type GetRecordsParams = {
  page: number;
  searchTerm?: string;
  sort?: SortingState;
};

type SortOrder = "asc" | "desc";

const DEFAULT_ORDER_BY = {
  name: "asc",
} as const;

export async function getRecords({
  page,
  searchTerm,
  sort = [],
}: GetRecordsParams) {
  const orderBy =
    sort.length > 0
      ? sort.reduce<Partial<Record<keyof RecordType, SortOrder>>>(
          (acc, { id, desc }) => {
            acc[id as keyof RecordType] = desc ? "desc" : "asc";

            return acc;
          },
          {},
        )
      : DEFAULT_ORDER_BY;

  const records = await prisma.record.findMany({
    skip: (page - 1) * RECORDS_PER_PAGE,
    take: RECORDS_PER_PAGE,
    orderBy,
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
  });

  return records.map((record) => ({
    id: record.id,
    name: record.name,
  }));
}

export async function getRecordPageCount({
  searchTerm,
}: {
  searchTerm?: string;
}) {
  const count = await prisma.record.count({
    where: { name: { contains: searchTerm, mode: "insensitive" } },
  });

  return Math.ceil(count / RECORDS_PER_PAGE);
}

export async function getRecordById(id: string) {
  const record = await prisma.record.findUnique({
    where: { id },
  });

  return record;
}

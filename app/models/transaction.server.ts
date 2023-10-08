import { ITEMS_PER_PAGE } from "~/constants.server";
import { prisma } from "~/db.server";

export async function getTransactions({
  recordId,
  page,
}: {
  recordId: string;
  page: number;
}) {
  const transactions = await prisma.transaction.findMany({
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    where: {
      recordId,
    },
  });

  return transactions;
}

export async function getTransactionPageCount({
  recordId,
}: {
  recordId: string;
}) {
  const count = await prisma.transaction.count({
    where: {
      recordId,
    },
  });

  return Math.ceil(count / ITEMS_PER_PAGE);
}

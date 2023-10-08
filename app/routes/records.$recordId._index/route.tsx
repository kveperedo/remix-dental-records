import { DataTable } from "~/components/ui/data-table/table";
import { columns } from "./columns";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  getTransactionPageCount,
  getTransactions,
} from "~/models/transaction.server";
import { useLoaderData } from "@remix-run/react";
import DataTablePagination from "~/components/data-table-pagination";

const DEFAULT_PAGE = "1";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const recordId = params.recordId;
  const url = new URL(request.url);

  const page = url.searchParams.get("page") ?? DEFAULT_PAGE;

  if (!recordId) {
    throw new Response("No record ID provided", { status: 400 });
  }

  const [data, pageCount] = await Promise.all([
    getTransactions({ page: Number(page), recordId }),
    getTransactionPageCount({ recordId }),
  ]);

  return json({
    transactions: {
      data,
      pageCount,
    },
  });
};

export default function RecordIndexPage() {
  const {
    transactions: { data, pageCount },
  } = useLoaderData<typeof loader>();

  return (
    <>
      <DataTable className="overflow-hidden" columns={columns} data={data} />
      {pageCount > 1 && (
        <div className="mt-auto">
          <DataTablePagination pageCount={pageCount} />
        </div>
      )}
    </>
  );
}

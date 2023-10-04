import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getRecordPageCount, getRecords } from "~/models/record.server";
import { columns } from "./columns";
import { DataTable } from "~/components/ui/data-table/table";
import type { SortingState } from "@tanstack/react-table";
import RecordDialog from "../../components/record-dialog";
import DataTablePagination from "~/components/data-table-pagination";

const DEFAULT_PAGE = "1";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const page = url.searchParams.get("page") ?? DEFAULT_PAGE;
  const searchTerm = url.searchParams.get("search") ?? "";
  const sort: SortingState = JSON.parse(url.searchParams.get("sort") || "[]");

  const [data, pageCount] = await Promise.all([
    getRecords({ page: Number(page), searchTerm, sort }),
    getRecordPageCount({ searchTerm }),
  ]);

  return json({ records: { data, pageCount }, searchTerm });
};

export const meta: MetaFunction = () => [
  {
    title: "Records",
    description: "View and manage patient records",
  },
];

export default function MainIndexPage() {
  const {
    records: { data, pageCount },
    searchTerm,
  } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort: SortingState = JSON.parse(searchParams.get("sort") || "[]");

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <Form
          className="flex flex-1 items-center gap-2 sm:flex-none"
          method="get"
        >
          <input
            type="hidden"
            name="sort"
            value={searchParams.get("sort") ?? ""}
          />
          <Input
            className="w-full sm:w-56"
            defaultValue={searchTerm}
            autoComplete="off"
            name="search"
            type="search"
            placeholder="Search records..."
          />

          <Button
            variant="outline"
            className="hidden gap-2 sm:flex"
            type="submit"
          >
            <Search size="20" />
            <span>Search</span>
          </Button>
        </Form>

        <RecordDialog />
      </div>

      <DataTable
        className="overflow-hidden"
        columns={columns}
        data={data}
        state={{ sorting: sort }}
        onSortingChange={(getSortValues) => {
          const sortValue = (getSortValues as any)() as SortingState;
          setSearchParams((setter) => {
            setter.set("sort", JSON.stringify(sortValue));
            return setter;
          });
        }}
      />

      {pageCount > 0 && (
        <div className="mt-auto">
          <DataTablePagination pageCount={pageCount} />
        </div>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.log(error);

  return (
    <div className="flex h-full w-full">
      <h1 className="m-auto text-lg font-semibold">
        An error has occurred when loading the records. Please try again later.
      </h1>
    </div>
  );
}

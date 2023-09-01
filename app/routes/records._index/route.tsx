import { json } from "@remix-run/node";
import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Pagination from "~/components/ui/pagination";
import { getRecordPageCount, getRecords } from "~/models/record.server";
import { columns } from "./columns";
import { DataTable } from "~/components/ui/data-table/table";
import type { SortingState } from "@tanstack/react-table";

const DEFAULT_PAGE = "1";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const page = url.searchParams.get("page") ?? DEFAULT_PAGE;
  const searchTerm = url.searchParams.get("search") ?? "";
  const sort: SortingState = JSON.parse(url.searchParams.get("sort") || "[]");

  const [data, pageCount] = await Promise.all([
    getRecords({ page: Number(page), searchTerm, sort }),
    getRecordPageCount({ searchTerm }),
  ]);

  return json(
    { records: { data, pageCount }, searchTerm },
    {
      headers: { "Cache-Control": "max-age=60, stale-while-revalidate=60" },
    },
  );
};

export const meta: V2_MetaFunction = () => [
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
  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE);
  const sort: SortingState = JSON.parse(searchParams.get("sort") || "[]");

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      <Form className="flex items-center gap-2" method="get">
        <Input
          defaultValue={searchTerm}
          autoComplete="off"
          name="search"
          type="search"
          placeholder="Search records..."
        />
        <input
          type="hidden"
          name="sort"
          value={searchParams.get("sort") ?? ""}
        />
        <Button className="gap-2" type="submit">
          <Search size="20" />
          <span>Search</span>
        </Button>
      </Form>

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
          <Pagination
            key={searchTerm + page}
            total={pageCount}
            initialPage={page}
            onChange={(page) =>
              setSearchParams((setter) => {
                setter.set("page", page.toString());
                return setter;
              })
            }
          />
        </div>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="flex h-full w-full">
      <h1 className="m-auto text-lg font-semibold">
        An error has occurred when loading the records. Please try again later.
      </h1>
    </div>
  );
}

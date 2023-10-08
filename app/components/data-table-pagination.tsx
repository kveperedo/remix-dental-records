import { useSearchParams } from "@remix-run/react";
import Pagination from "./ui/pagination";

type DataTablePaginationProps = {
  pageCount: number;
};

const DEFAULT_PAGE = "1";

const DataTablePagination = ({ pageCount }: DataTablePaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE);

  const handlePageChange = (page: number) => {
    setSearchParams((setter) => {
      setter.set("page", page.toString());
      return setter;
    });
  };

  return (
    <Pagination total={pageCount} page={page} onChange={handlePageChange} />
  );
};

export default DataTablePagination;

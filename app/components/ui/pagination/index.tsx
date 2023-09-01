import { DOTS, usePaginationState } from "./usePaginationState";
import { Button } from "../button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationProps = {
  total: number;
  initialPage?: number;
  onChange?: (page: number) => void;
};

const Pagination = ({ total, initialPage, onChange }: PaginationProps) => {
  const { range, active, next, previous, setPage } = usePaginationState({
    total,
    initialPage,
    onChange,
  });

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        disabled={active === 1}
        onClick={previous}
      >
        <ChevronsLeft className="h-5 w-5 text-inherit" />
      </Button>
      {range.map((page, index) => {
        if (page === DOTS) {
          return (
            <div
              className="flex h-8 w-8 items-center justify-center"
              key={`${page}_${index}`}
            >
              ...
            </div>
          );
        }

        return (
          <Button
            size="icon-sm"
            onClick={() => setPage(page)}
            variant={page === active ? "default" : "outline"}
            key={page}
          >
            {page}
          </Button>
        );
      })}
      <Button
        variant="outline"
        size="icon-sm"
        disabled={active === total}
        onClick={next}
      >
        <ChevronsRight className="h-5 w-5 text-inherit" />
      </Button>
    </div>
  );
};

export default Pagination;

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CaptionProps } from "react-day-picker";
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker";

import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import { format, setMonth, setYear, startOfMonth, startOfYear } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Virtuoso } from "react-virtuoso";

const DEFAULT_START_YEAR = 1923;
const DEFAULT_END_YEAR = startOfYear(new Date()).getFullYear();

const Caption = (props: CaptionProps) => {
  const {
    formatters: { formatMonthCaption, formatYearCaption },
    locale,
    fromDate,
    toDate,
  } = useDayPicker();
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  const dropdownMonths = React.useMemo(() => {
    const months: Date[] = [];

    const date = startOfMonth(new Date()); // Any date should be OK, as we just need the year
    for (let month = 0; month <= 11; month++) {
      months.push(setMonth(date, month));
    }

    return months;
  }, []);

  const dropdownYears = React.useMemo(() => {
    const years: number[] = [];

    const fromYear = fromDate?.getFullYear() ?? DEFAULT_START_YEAR;
    const toYear = toDate?.getFullYear() ?? DEFAULT_END_YEAR;
    for (let year = fromYear; year <= toYear; year++) {
      years.push(setYear(startOfYear(new Date()), year).getFullYear());
    }

    return years;
  }, [fromDate, toDate]);

  const handleYearChange = (year: string) => {
    const newMonth = setYear(startOfMonth(props.displayMonth), parseInt(year));
    goToMonth(newMonth);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Select
          value={props.displayMonth.getMonth().toString()}
          onValueChange={(value) => {
            goToMonth(setMonth(startOfMonth(new Date()), parseInt(value)));
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="h-64">
            {dropdownMonths.map((month) => (
              <SelectItem
                key={month.getMonth()}
                value={month.getMonth().toString()}
              >
                {formatMonthCaption(month, { locale })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={props.displayMonth.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger>
            {formatYearCaption(props.displayMonth, { locale })}
          </SelectTrigger>
          <SelectContent className="h-64">
            <Virtuoso
              className="h-64"
              totalCount={dropdownYears.length}
              data={dropdownYears}
              initialTopMostItemIndex={dropdownYears.indexOf(
                props.displayMonth.getFullYear(),
              )}
              itemContent={(_index, year) => (
                <SelectItem key={year} value={year.toString()}>
                  {formatYearCaption(setYear(startOfYear(new Date()), year), {
                    locale,
                  })}
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Button
          disabled={!previousMonth}
          onClick={() => previousMonth && goToMonth(previousMonth)}
          variant="outline"
          size="icon-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-sm font-medium">
          {format(props.displayMonth, "MMMM yyy")}
        </p>
        <Button
          disabled={!nextMonth}
          onClick={() => nextMonth && goToMonth(nextMonth)}
          variant="outline"
          size="icon-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

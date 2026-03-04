import { useState, type ReactNode } from "react";
import EmptyState from "./EmptyState";
import { Card } from "./shadcn/card";
import { Skeleton } from "./shadcn/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./shadcn/table";
import clsx from "clsx";
import { ChevronDown, ChevronRight, Divide } from "lucide-react";

type DataTableColumn<T> = {
  key: string;
  label: string;
  render?(item: T): ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  expandedContent?(item: T): ReactNode;
};

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  isLoading = false,
  emptyTitle,
  emptyMessage,
  expandedContent,
}: DataTableProps<T>) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleRow = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const hasExpansion = expandedContent !== undefined;

  if (isLoading) {
    return (
      <Card className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              {hasExpansion && <TableHead className="w-12" />}
              {columns.map((col) => (
                <TableHead key={col.key} className="font-medium">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i} className="border-b last:border-0">
                {hasExpansion && (
                  <TableCell className="w-12">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-5 w-full max-w-[200px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <Table className="mt-10">
      <TableHeader>
        <TableRow className="border-gray-300">
          {columns.map((col) => (
            <TableHead key={col.key} className="font-normal text-gray-500 py-3">
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => {
          const isExpanded = item.id === expandedId;
          const isLast = index === data.length - 1;

          return (
            <>
              <TableRow
                key={item.id}
                className={clsx(
                  "transition-colors border-slate-200",
                  hasExpansion && "cursor-pointer",
                  !isExpanded && !isLast && "border-b",
                  isExpanded && "bg-muted/20 border-b"
                )}
                onClick={() => hasExpansion && toggleRow(item.id)}
              >
                {columns.map((col, index) => (
                  <TableCell key={col.key} className={clsx("py-4", index === 0 && "flex gap-2 align-center")}>
                    {index === 0 && hasExpansion && !isExpanded && <ChevronDown size={18}/>}
                    {index === 0 && hasExpansion && isExpanded && <ChevronRight size={18}/>}

                    {col.render
                      ? col.render(item)
                      : String((item as any)[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>

              {isExpanded && expandedContent && (
                <TableRow className={clsx(!isLast && "border-b")}>
                  <TableCell
                    colSpan={columns.length + (hasExpansion ? 1 : 0)}
                    className="p-0 bg-muted/30"
                  >
                    <div className="overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      <div className="px-6 py-4">{expandedContent(item)}</div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}

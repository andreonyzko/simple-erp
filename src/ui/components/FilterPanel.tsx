import type { PropsWithChildren } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./shadcn/card";
import { Button } from "./shadcn/button";
import { X } from "lucide-react";
import clsx from "clsx";

type FilterPanelProps = {
  isOpen: boolean;
  onClose(): void;
  onClear?(): void;
  title?: string;
};

export default function FilterPanel({
  isOpen,
  onClose,
  onClear,
  title = "Filtros",
  children,
}: PropsWithChildren<FilterPanelProps>) {
  return (
    <>
      {isOpen && (
        <div className="absolute bg-black/40 inset-0 z-10" onClick={onClose} />
      )}
      <Card
        className={clsx(
          "min-w-64 rounded-none absolute right-0 inset-y-0 z-10 transition-all duration-200",
          isOpen ? "translate-x-0" : "translate-x-100"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-slate-900 text-white">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex gap-2 items-center">
            {onClear && (
              <Button onClick={onClear} variant="ghost" size="sm">
                Limpar
              </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col">
          {children}
        </CardContent>
      </Card>
    </>
  );
}

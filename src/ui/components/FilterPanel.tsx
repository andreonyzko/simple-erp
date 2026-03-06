import type { PropsWithChildren } from "react";
import { Button } from "./shadcn/button";
import { X } from "lucide-react";
import clsx from "clsx";
import { Separator } from "./shadcn/separator";

type FilterPanelProps = {
  isOpen: boolean;
  onClose(): void;
  onClear?(): void;
};

export default function FilterPanel({
  isOpen,
  onClose,
  onClear,
  children,
}: PropsWithChildren<FilterPanelProps>) {
  return (
    <>
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 right-0 z-50 w-full bg-background border-l shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:w-96",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-900 text-white">
          <div>
            <h2 className="text-lg font-semibold">Filtros</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Refine sua busca
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">{children}</div>
        </div>

        <Separator />

        {onClear && (
          <div className="px-6 py-4 bg-muted/20 border-t">
            <div className="flex gap-3">
              <Button
                onClick={onClear}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Limpar filtros
              </Button>
              <Button onClick={onClose} className="flex-1" size="sm">
                Aplicar
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
import type { PropsWithChildren } from "react";
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
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 bg-black/40 z-30 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 right-0 z-40 w-80 bg-card border-l shadow-lg transition-transform duration-200",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b">
          <h2 className="font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            {onClear && (
              <Button onClick={onClear} variant="ghost" size="sm">
                Limpar
              </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">{children}</div>
        </div>
      </aside>
    </>
  );
}

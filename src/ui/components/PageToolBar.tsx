import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./shadcn/input";
import { Button } from "./shadcn/button";
import { Link } from "react-router";

type PageToolBarProps = {
  title: string
  searchValue?: string;
  onSearchChange?(value: string): void;
  searchPlaceholder?: string;
  createPath?: string;
  createLabel?: string;
  onToggleFilters?(): void;
  showFilters?: boolean;
};

export default function PageToolBar({
  title,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Buscar...",
  createPath,
  createLabel = "Novo",
  onToggleFilters,
}: PageToolBarProps) {
  return (
    <div className="flex flex-col flex-wrap gap-2 md:flex-row md:justify-between">
      <div className="w-full flex flex-col gap-1 py-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-slate-500">Lorem ipsum, dolor sit amet</p>
      </div>
      <div className="flex-1 flex gap-2">
        {onSearchChange && (
          <div className="relative flex-1 ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {onToggleFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleFilters}
            aria-label="Filtros"
          >
            <SlidersHorizontal className="h-4 w-4"/>
          </Button>
        )}
      </div>

      {createPath && (
        <Button asChild>
          <Link to={createPath}>
            <Plus className="mr-2 h-4 w-4"/>
            {createLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

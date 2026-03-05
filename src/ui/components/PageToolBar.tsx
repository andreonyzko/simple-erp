import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./shadcn/input";
import { Button } from "./shadcn/button";
import { Link } from "react-router";

type PageToolBarProps = {
  title: string;
  pageDescription: string;
  searchValue?: string;
  onSearchChange?(value: string): void;
  searchPlaceholder?: string;
  createPath?: string;
  createLabel?: string;
  onToggleFilters?(): void;
};

export default function PageToolBar({
  title,
  pageDescription,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Buscar...",
  createPath,
  createLabel = "Novo",
  onToggleFilters,
}: PageToolBarProps) {
  return (
    <div className="sticky top-0 z-20 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4">
        {/* Título e Descrição */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {pageDescription}
            </p>
          </div>

          {/* Botão Novo - Desktop */}
          {createPath && (
            <Button asChild className="hidden md:flex">
              <Link to={createPath}>
                <Plus className="mr-2 h-4 w-4" />
                {createLabel}
              </Link>
            </Button>
          )}
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col gap-2 md:flex-row">
          {onSearchChange && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          <div className="flex gap-2">
            {onToggleFilters && (
              <Button
                variant="outline"
                onClick={onToggleFilters}
                className="flex-1"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span className="md:inline">Filtros</span>
              </Button>
            )}

            {/* Botão Novo - Mobile */}
            {createPath && (
              <Button asChild className="md:hidden flex-1">
                <Link to={createPath}>
                  <Plus className="mr-2 h-4 w-4" />
                  {createLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

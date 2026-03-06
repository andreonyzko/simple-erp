import FilterPanel from "@/ui/components/FilterPanel";
import PageToolBar from "@/ui/components/PageToolBar";
import { useDebounceSearch } from "@/ui/hooks/useDebounceSearch";
import { useQueryParams } from "@/ui/hooks/useQueryParams";
import { useEffect, useState } from "react";

export default function PurchasesListPage() {
  const { getParam, setParam, clearParams } = useQueryParams();

  const [searchInput, setSearchInput] = useState<string>(
    getParam("search") ?? ""
  );
  const debouncedSearch = useDebounceSearch(searchInput);
  useEffect(() => {
    setParam("search", debouncedSearch);
  }, [debouncedSearch]);

  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const handleToggleFilters = () => setFiltersOpen((prev) => !prev);
  const handleCloseFilters = () => setFiltersOpen(false);
  const handleClearFilters = () => {
    setSearchInput("");
    clearParams();
    handleCloseFilters();
  };

  return (
    <div>
      <PageToolBar
        title="Compras"
        pageDescription="Gerencie e visualize suas compras"
        createLabel="Nova compra"
        createPath="/compras/cadastrar"
        searchPlaceholder="Buscar compra..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onToggleFilters={handleToggleFilters}
      />
      <FilterPanel
        isOpen={filtersOpen}
        onClose={handleCloseFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}

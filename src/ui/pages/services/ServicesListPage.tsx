import FilterPanel from "@/ui/components/FilterPanel";
import PageToolBar from "@/ui/components/PageToolBar";
import { useDebounceSearch } from "@/ui/hooks/useDebounceSearch";
import { useQueryParams } from "@/ui/hooks/useQueryParams";
import { useEffect, useState } from "react";

export default function ServicesListPage() {
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
        title="Serviços"
        pageDescription="Gerencie e visualize seus serviços"
        createLabel="Novo serviço"
        createPath="/servicos/cadastrar"
        searchPlaceholder="Buscar serviço..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onToggleFilters={handleToggleFilters}
      />
      <FilterPanel
        isOpen={filtersOpen}
        onClose={handleCloseFilters}
        onClear={handleClearFilters}
      ></FilterPanel>
    </div>
  );
}

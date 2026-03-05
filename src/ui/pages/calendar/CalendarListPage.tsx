import DatePickerField from "@/ui/components/DatePickerField";
import FilterPanel from "@/ui/components/FilterPanel";
import LoadingSpinner from "@/ui/components/LoadingSpinner";
import PageToolBar from "@/ui/components/PageToolBar";
import { useDebounceSearch } from "@/ui/hooks/useDebounceSearch";
import { useQueryParams } from "@/ui/hooks/useQueryParams";
import {
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

export default function CalendarListPage() {
  const { getParam, setParam, clearParams } = useQueryParams();

  const [searchInput, setSearchInput] = useState(getParam("search") ?? "");
  const debouncedSearch = useDebounceSearch(searchInput);
  useEffect(() => {
    if (debouncedSearch !== (getParam("search") ?? ""))
      setParam("search", debouncedSearch || null);
  }, [debouncedSearch]);
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const handleClearFilters = () => {
    clearParams();
    setSearchInput("");
  };
  const fromDefault = startOfMonth(new Date());
  const toDefault = endOfMonth(new Date());
  const dateRange: DateRange | undefined = {
    from: getParam("from") ? new Date(getParam("from")!) : fromDefault,
    to: getParam("to") ? new Date(getParam("to")!) : toDefault,
  };
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      setParam("from", null);
      setParam("to", null);
      return;
    }

    setParam("from", range.from?.toISOString().split("T")[0] ?? null);
    setParam("to", range.to?.toISOString().split("T")[0] ?? null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <PageToolBar
        title="Agenda"
        pageDescription="Gerencie e visualize seus eventos"
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Buscar evento..."
        createPath="/agenda/cadastrar"
        createLabel="Novo Evento"
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
      />

      <FilterPanel
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onClear={handleClearFilters}
      >
        <DatePickerField
          label="Período"
          value={dateRange}
          onChange={handleDateRangeChange}
        />
      </FilterPanel>

      <LoadingSpinner size="lg"/>
    </div>
  );
}

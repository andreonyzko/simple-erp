import type { CalendarEvent } from "@/domain/entities/calendar";
import DataTable from "@/ui/components/DataTable";
import DatePickerField from "@/ui/components/DatePickerField";
import FilterPanel from "@/ui/components/FilterPanel";
import PageToolBar from "@/ui/components/PageToolBar";
import { Button } from "@/ui/components/shadcn/button";
import { useDebounceSearch } from "@/ui/hooks/useDebounceSearch";
import { useQueryParams } from "@/ui/hooks/useQueryParams";
import { Label } from "@radix-ui/react-dropdown-menu";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Link, useLoaderData } from "react-router";

type LoaderData = {
  events: CalendarEvent[];
};

export default function CalendarListPage() {
  const events: CalendarEvent[] = [
    {
      id: 0,
      title: "Corte da Priscila",
      date: new Date(),
      description: "Teste",
    },
    {
      id: 1,
      title: "Botox da Viviane",
      date: new Date(),
      description: "Teste 2",
    },
  ];
  // const {events} = useLoaderData() as LoaderData;

  const { getParam, setParam, clearParams } = useQueryParams();

  const [searchInput, setSearchInput] = useState(getParam("search") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounceSearch(searchInput);

  useEffect(() => {
    if (debouncedSearch !== (getParam("search") ?? ""))
      setParam("search", debouncedSearch || null);
  }, [debouncedSearch]);

  const handleClearFilters = () => {
    clearParams();
    setSearchInput("");
  };

  const columns = [
    {
      key: "date",
      label: "Data",
      render: (event: CalendarEvent) => (
        <span>
          {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
        </span>
      ),
    },
    {
      key: "title",
      label: "Título",
    },
  ];

  const fromDefault = startOfMonth(new Date());
  const toDefault = endOfMonth(new Date());

  const [dateRange] = useState<DateRange | undefined>({
    from: getParam("from") ? new Date(getParam("from")!) : fromDefault,

    to: getParam("to") ? new Date(getParam("to")!) : toDefault
  })

  function handleDateRangeChange(range: DateRange | undefined) {
    if(!range){
      setParam("from", null);
      setParam("to", null);
      return;
    }

    setParam("from", range.from?.toISOString().split("T")[0] ?? null);
    setParam("to", range.to?.toISOString().split("T")[0] ?? null);
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageToolBar
      title="Agenda"
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

      <DataTable
        columns={columns}
        data={events}
        emptyTitle="Nenhum evento encontrado"
        expandedContent={(event) => (
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Label className="font-medium">ID</Label>
              <p>{event.id}</p>
            </div>

            {event.description && (
              <div className="flex gap-2">
                <Label className="font-medium">Descrição</Label>
                <p>{event.description}</p>
              </div>
            )}

            <div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/agenda/${event.id}/editar`}>
                  <Edit />
                  Editar
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/`}>
                  <Trash2 />
                  Excluir
                </Link>
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

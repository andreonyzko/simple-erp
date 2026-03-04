import { Label } from "./shadcn/label";
import { Popover, PopoverTrigger } from "./shadcn/popover";
import { Button } from "./shadcn/button";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PopoverContent } from "./shadcn/popover";
import { Calendar } from "./shadcn/calendar";
import { cn } from "@/lib/utils";

type DatePickerFieldProps = {
  label: string;
  value: DateRange | undefined;
  onChange(date: DateRange | undefined): void;
  placeholder?: string;
};

export default function DatePickerField({
  label,
  value,
  onChange,
  placeholder = "Selecionar uma data",
}: DatePickerFieldProps) {
  function formatRange(range: DateRange | undefined) {
    if (!range?.from) return placeholder;
    if (!range.to) return format(range.from, "dd/MM/yyyy", { locale: ptBR });

    return `${format(range.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(
      range.to,
      "dd/MM/yyyy",
      { locale: ptBR }
    )}`;
  }

  return (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !value?.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {formatRange(value)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={value}
                    onSelect={onChange}
                    locale={ptBR}
                    numberOfMonths={2}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    </div>
  );
}

"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importa la localización española
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ReceiptForm } from "./tables/receipt-um-tab/new-receipt-button";
import { monthNames } from "@/constants/MonthNames";

interface Props {
  receiptForm: ReceiptForm,
  setReceiptForm: React.Dispatch<React.SetStateAction<ReceiptForm>>
}

export function DatePicker({ receiptForm, setReceiptForm }: Props) {
  // Estado para controlar la apertura del Popover
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Calcula la fecha del primer día del mes actual
  const getFirstDayOfCurrentMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  // Maneja la selección de la fecha
  const handleDateSelect = (date: Date | undefined) => {
    setReceiptForm({
      ...receiptForm,
      date: date ? date : getFirstDayOfCurrentMonth(),
      period: date ? monthNames[date.getMonth()] : monthNames[getFirstDayOfCurrentMonth().getMonth()]
    });

    // Cierra el Popover cuando se selecciona una fecha
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !receiptForm.date && "text-muted-foreground"
          )}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)} // Alterna la visibilidad del Popover
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {receiptForm.date ? format(receiptForm.date, "PPP", { locale: es }) : <span>Elige una fecha</span>} {/* Aplica la localización española */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={receiptForm.date}
          onSelect={handleDateSelect} // Maneja la selección de la fecha y cierra el Popover
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}

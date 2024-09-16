import { ReceiptUMTable } from "@/components/tables/receipt-um-tab/receipt-um-table";
import { Button } from "@/components/ui/button";
import { User } from "@/constants/User/user";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePickerReceiptUm } from "./date-range-picker-receipt-um";

export interface ReceiptUmFilter {
  dateRange?: DateRange;
  pending?: boolean;
  complete?: boolean;
}

interface Props {
  user: User | null;
}

export function ReceiptTab({ user }: Props) {
  const [receiptFilters, setReceiptFilters] = useState<ReceiptUmFilter | undefined>(undefined);

  const handlePendingClick = () => {
    setReceiptFilters({
      ...receiptFilters,
      pending: !receiptFilters?.pending, // Alternar el estado de "pending"
      complete: false, // Desactivar "complete" al seleccionar "pending"
    });
  };

  const handleCompleteClick = () => {
    setReceiptFilters({
      ...receiptFilters,
      complete: !receiptFilters?.complete, // Alternar el estado de "complete"
      pending: false, // Desactivar "pending" al seleccionar "complete"
    });
  };

  return (
    <>
      <div className="flex flex-row gap-2 h-full">
        <div className="flex-1 w-full">
          <div className="flex flex-row justify-between">
            <CalendarDateRangePickerReceiptUm date={receiptFilters?.dateRange} setReceiptFilters={setReceiptFilters} />
            <Button
              variant={receiptFilters?.pending ? "default" : "outline"}
              onClick={handlePendingClick}
            >
              {"Pendientes: 1"}
            </Button>
            <Button
              variant={receiptFilters?.complete ? "default" : "outline"}
              onClick={handleCompleteClick}
            >
              {"Completados: 1"}
            </Button>
          </div>
          <ReceiptUMTable title={"Recibos"} addNewButton={true} user={user} receiptUmFilter={receiptFilters} />
        </div>
        <div className="flex-1 w-full"></div>
      </div>
    </>
  );
}

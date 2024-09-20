import { ReceiptUMTable } from "@/components/tables/receipt-um-tab/receipt-um-table";
import { Button } from "@/components/ui/button";
import { User } from "@/constants/User/user";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePickerReceiptUm } from "./date-range-picker-receipt-um";
import { Receipt } from "@/constants/Receipt/Receipt";
import { Separator } from "@/components/ui/separator";
import { Company } from "@/constants/Company/Company";

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
  const [receiptSelected, setReceiptSelected] = useState<Receipt | undefined>(undefined);
  const [companyReceipt, setCompanyReceipt] = useState<Company | undefined>(undefined);
  //traer compañia para el user dentro de userCompany, ya que solo viene el tipo de recibo

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

  useEffect(() => {
        console.log(user)
       const company = user?.userCompany?.find((userCompany) => { return userCompany.company?.uuid == receiptSelected?.companyUuid; })
       setCompanyReceipt(company?.company);
  }, [receiptSelected])

  return (
    <>
      <div className="flex flex-row gap-2 ">
        <div className="flex-1 w-full">
          <div className="flex flex-row justify-between ">
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
          <ReceiptUMTable title={"Recibos"} addNewButton={true} user={user} receiptUmFilter={receiptFilters} setReceiptSelected={setReceiptSelected} />
        </div>
        <Separator  orientation="vertical"/>
        <div className="flex-1 w-full">
          { receiptSelected == undefined ? <></> : 
            
            <div>
              <h1>Recibo</h1>
              <p className="text-[8px]">{receiptSelected.uuid}</p>
              <h1>Compañia</h1>
              <p>{companyReceipt?.name}</p>
              <p>{companyReceipt?.email}</p>
              <p>{companyReceipt?.address}</p>
            </div>
            
          }
        </div>
      </div>
    </>
  );
}

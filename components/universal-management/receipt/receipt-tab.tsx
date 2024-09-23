import { ReceiptUMTable } from "@/components/tables/receipt-um-tab/receipt-um-table";
import { Button } from "@/components/ui/button";
import { User } from "@/constants/User/user";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePickerReceiptUm } from "./date-range-picker-receipt-um";
import { Receipt } from "@/constants/Receipt/Receipt";
import { Separator } from "@/components/ui/separator";
import { Company } from "@/constants/Company/Company";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { monthNames } from "@/constants/MonthNames";
import { CheckIcon } from "@radix-ui/react-icons";
import { PencilIcon } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false)
  const handleEdit = () => {
    setIsEditing(!isEditing)
  }
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
        <Separator orientation="vertical" />
        <div className="flex-1 w-full">
          {receiptSelected == undefined ? <></> :

            <div className="flex flex-col gap-3 p-4 pt-0">
              <div>
                <h1 >Recibo</h1>
                <p className="text-[8px]">{receiptSelected.uuid}</p>
              </div>
              <div className="flex flex-row justify-between">
                <div>

                  <h1 className="pb-2">Compañia</h1>
                  <p>{companyReceipt?.name}</p>
                  <p>{companyReceipt?.email}</p>
                  <p>{companyReceipt?.address}</p>
                </div>
                <div className="">


                  <h1 className="pb-2">Usuario</h1>
                  <p>{user?.name}</p>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <p>{"Periodo: " + ((receiptSelected.createdAt && !isNaN(new Date(receiptSelected.createdAt).getTime()))
                  ? monthNames[new Date(receiptSelected.createdAt).getMonth()]
                  : 'No definido')}</p>
                <p>{"Fecha Cobro: " + ((receiptSelected.chargedAt && !isNaN(new Date(receiptSelected.chargedAt).getTime()))
                  ? (new Date(receiptSelected.chargedAt)).toLocaleDateString()
                  : 'No cobrado')}</p>
              </div>

              <Card>
                <CardHeader className="flex flex-row p-0 justify-end">
                    <Button variant="ghost" size="icon" onClick={handleEdit}>
                      {isEditing ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                    </Button>
                </CardHeader>
                <CardContent>

                  <div className="flex flex-col justify-between">

                    <div>
                      <p>{"Tipo de recibo: " + receiptSelected.receiptType?.name}</p>
                      <p>{"Concepto: " + receiptSelected.receiptType?.concept}</p>
                      <p>{"Precio: " + receiptSelected.receiptType?.price +" €"}</p>
                    </div>
                    <div className="">

                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex fles-row gap-4 justify-end">
                  {
                    receiptSelected.status == "PENDING" ? 
                    <>
                      <Button>Cobrar</Button>
                    </> : 
                    <>
                       <Button>Imprimir</Button>
                       <Button>Email</Button>
                       <Button>Whatsapp</Button>
                    </>
                  }
                  </div>
            </div>


          }
        </div>
      </div>
    </>
  );
}

import { ReceiptUMTable } from "@/components/tables/receipt-um-tab/receipt-um-table";
import { Button } from "@/components/ui/button";
import { User } from "@/constants/User/user";
import { SetStateAction, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePickerReceiptUm } from "./date-range-picker-receipt-um";
import { Receipt } from "@/constants/Receipt/Receipt";
import { Separator } from "@/components/ui/separator";
import { Company } from "@/constants/Company/Company";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { monthNames } from "@/constants/MonthNames";
import { CheckIcon } from "@radix-ui/react-icons";
import { PencilIcon, XIcon } from "lucide-react";
import { ComboboxReceiptType } from "@/components/ui/custom/universal-management/combobox/combobox-receipt-type";
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { editReceiptAction } from "@/actions/universal-management/receipt/editReceiptAction";

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
  const [receiptTypeSelected, setReceiptTypeSelected] = useState<ReceiptType | null>(null);
  const [receiptTypeName, setReceiptTypeName] = useState<string>(receiptSelected?.receiptType?.name ?? "Personalizado");
  const [refresh, setRefresh] = useState<number>(0);
  const [externalReceipt, setExternalReceipt] = useState<Receipt[] | undefined>(undefined);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [completeCount, setCompleteCount] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [prevUser, setPrevUser] = useState<User | null>(null);
  const [prevDateRange, setPrevDateRange] = useState<DateRange | undefined>(undefined);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setConcept(receiptSelected?.concept?.toString());
    setPrice(receiptSelected?.amount?.toString());
    setReceiptTypeSelected(receiptSelected?.receiptType ?? null);
  };

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

  const [concept, setConcept] = useState<string | undefined>(receiptSelected?.concept?.toString());
  const [price, setPrice] = useState<string | undefined>(receiptSelected?.amount?.toString());

  useEffect(() => {
    if (receiptTypeSelected) {
      setConcept(receiptTypeSelected.concept == null ? receiptSelected?.concept?.toString() : receiptTypeSelected.concept);
      setPrice(receiptTypeSelected.price?.toString());
    } else {
      setConcept(receiptSelected?.concept ?? "");
      setPrice(receiptSelected?.amount?.toString() ?? "");
    }
  }, [receiptTypeSelected]);

  useEffect(() => {
    setIsEditing(false);
    setReceiptSelected(undefined);
    setReceiptFilters(undefined);
  }, [user]);

  useEffect(() => {
    const company = user?.userCompany?.find((userCompany) => { return userCompany.company?.uuid == receiptSelected?.companyUuid; });
    setCompanyReceipt(company?.company);
    setReceiptTypeSelected(receiptSelected?.receiptType ?? null);
    setReceiptTypeName(receiptSelected?.receiptType?.name ?? "Personalizado");
    if (receiptSelected) {
      setConcept(receiptSelected.concept?.toString());
      setPrice(receiptSelected.amount?.toString());
      setIsEditing(false);
    }
  }, [receiptSelected]);

  const chargeReceipt = async () => {
    if (receiptSelected) {
      receiptSelected.status = "CHARGED";
      const receiptR = await editReceiptAction(receiptSelected, receiptSelected.companyUuid)
      receiptSelected.chargedAt = receiptR.chargedAt;
      setReceiptTypeName(receiptSelected?.receiptType?.name ?? "Personalizado");
      setRefresh(Math.random());
    }
  };

  const editReceipt = async () => {
    if (receiptSelected) {
      receiptSelected.amount = Number(price);
      receiptSelected.concept = concept;
      receiptSelected.receiptTypeUuid = receiptTypeSelected == null ? undefined : receiptTypeSelected.uuid;
      receiptSelected.receiptType = receiptTypeSelected == null ? undefined : receiptTypeSelected;
      const receiptT = await editReceiptAction(receiptSelected, receiptSelected.companyUuid)
      setReceiptSelected(receiptT);
      setReceiptTypeName(receiptT.receiptType?.name ?? "Personalizado");
      setIsEditing(false);
      setRefresh(Math.random());
    }
  };

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
              {"Pendientes: " + pendingCount}
            </Button>
            <Button
              variant={receiptFilters?.complete ? "default" : "outline"}
              onClick={handleCompleteClick}
            >
              {"Completados: " + completeCount}
            </Button>
          </div>
          <ReceiptUMTable
            title={"Recibos"}
            addNewButton={true}
            user={user}
            receiptUmFilter={receiptFilters}
            setReceiptSelected={setReceiptSelected}
            refresh={refresh} setRefresh={setRefresh}
            setExternalReceipt={setExternalReceipt} 
            setPendingCount={setPendingCount}
            setCompleteCount={setCompleteCount}/>
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
                  {isEditing ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => editReceipt()} style={{ marginTop: "0" }}>
                        <CheckIcon className="h-4 w-4" />
                      </Button>

                    </>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={handleEdit}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>

                  <div className="flex flex-col justify-between">
                    {!isEditing ? (
                      <div>
                        <p>{"Tipo de recibo: " + receiptTypeName}</p>
                        <p>{"Concepto: " + (receiptSelected.concept ?? '')}</p>
                        <p>{"Precio: " + receiptSelected.amount + " €"}</p>
                      </div>
                    ) : (
                      <>
                        <Label htmlFor="">Tipo de Recibo</Label>
                        <ComboboxReceiptType user={user} setReceiptTypeSelected={setReceiptTypeSelected} setValueTMP={receiptSelected.receiptType == undefined ? "" : receiptSelected.receiptType.uuid} preSelectUser={false} />
                        <Label htmlFor="concept">Concepto</Label>
                        <Input
                          id="concept"
                          name="concept"
                          type="text"
                          value={concept}
                          onChange={(e) => setConcept(e.target.value)}
                          placeholder={concept ?? ''}
                        />
                        <Label htmlFor="price">Precio</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder={price ?? '0'}
                          required
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="flex fles-row gap-4 justify-end">
                {
                  receiptSelected.status == "PENDING" ?
                    <>
                      <Button onClick={() => chargeReceipt()} disabled={isEditing}>Cobrar</Button>
                    </> :
                    <>
                      <Button disabled={isEditing}>Imprimir</Button>
                      <Button disabled={isEditing}>Email</Button>
                      <Button disabled={isEditing}>Whatsapp</Button>
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



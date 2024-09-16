'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { ReceiptForm } from "../../tables/receipt-um-tab/new-receipt-button";
import { Label } from "../../ui/label";
import { ComboboxNavbar } from "../../ui/custom/navbar/combobox";
import { ComboboxReceiptType } from "../../ui/custom/universal-management/combobox/combobox-receipt-type";
import { User } from "@/constants/User/user";
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType";
import { Button } from "../../ui/button";
import { createReceiptUMAction } from "@/actions/universal-management/receipt/createReceiptUMAction";
import { Receipt } from "@/constants/Receipt/Receipt";
import UserSessionContext from "../../layout/context/user-session";
import { Checkbox } from "../../ui/checkbox";
import { DatePicker } from "@/components/date-picker";
import { useToast } from "@/components/ui/use-toast";

interface Props{
  receiptForm: ReceiptForm,
  setReceiptForm: Dispatch<SetStateAction<ReceiptForm>>
  user: User | null,
  setOpen: Dispatch<SetStateAction<boolean>>,
  setRefresh: Dispatch<SetStateAction<number>>

}

export default function NewReceiptUmForm({receiptForm, setReceiptForm, user,setOpen,setRefresh}: Props) {
  const [receiptTypeSelected, setReceiptTypeSelected] = useState<ReceiptType | null>(null)
  const [checkCharged, setCheckCharged] = useState<boolean>(false)
  const userSessionContextType = useContext(UserSessionContext)
  const { toast } = useToast();

 const onClickCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault(); // Evita que la página se recargue
  console.log(user)
    const newReceipt: Receipt = {
        uuid: '',
        companyUuid: userSessionContextType.userSession?.selectedCompany!,
        recipientUuid: user?.uuid!,
        executorUuid: checkCharged ? userSessionContextType.userSession?.uuid : undefined,
        concept: receiptTypeSelected?.concept,
        amount: receiptTypeSelected?.price,
        status: checkCharged ? 'CHARGED' : 'PENDING',
        chargedAt: checkCharged ? receiptForm.date : undefined,
        receiptTypeUuid: receiptTypeSelected ? receiptTypeSelected.uuid : undefined,
        createdAt: receiptForm.date
    }
    const receipt = await createReceiptUMAction(newReceipt)
    setOpen(false) 
    setRefresh(Math.random())
    toast({
      variant: 'default',
      title: 'Recibo creado con exito',
      description: 'El recibo ha sido creado con exito'
    });
    
  }

useEffect(() => {
      setReceiptForm((prevForm) => ({
    ...prevForm, 
    receipTypeUuid: receiptTypeSelected ? receiptTypeSelected.uuid : '', 
  }));
},[receiptTypeSelected])

  return (
    <>
      <form>
        <div className="flex flex-col">
          <Label>Seleccionar Fecha </Label>
          <DatePicker receiptForm={receiptForm} setReceiptForm={setReceiptForm}></DatePicker>
          <Label>Periodo: </Label> 
          <p>{receiptForm.period}</p>
          <p>Tipo de recibo</p>
          <ComboboxReceiptType user={user} setReceiptTypeSelected={setReceiptTypeSelected}></ComboboxReceiptType>
          {receiptTypeSelected && (
          <>
            <p>Concepto: {receiptTypeSelected.concept}</p>
            <p>Precio: {receiptTypeSelected.price} €</p>
          </>
        )}
          <Checkbox checked={checkCharged} onCheckedChange={()=>{setCheckCharged(!checkCharged)}}></Checkbox>Crear como cobrado
          <Button onClick={onClickCreate}>Crear Recibo</Button>
        </div>
      </form>
    </>
  );
}

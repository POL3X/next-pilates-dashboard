"use client";


import NewReceiptUmForm from "@/components/forms/new-receipt-tab-um/new-receipt-um-form";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { monthNames } from "@/constants/MonthNames";
import { User } from "@/constants/User/user";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export interface ReceiptForm {
  date: Date;
  period: string;
  receipTypeUuid: string;
}

interface Props{
  user: User | null,
  setRefresh: Dispatch<SetStateAction<number>>
}

export function NewReceiptTabButton({user, setRefresh}:Props) {
  // Función para obtener el primer día del mes actual
  const getFirstDayOfCurrentMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [receiptForm, setReceiptForm] = useState<ReceiptForm>({
    date: getFirstDayOfCurrentMonth(),
    period: monthNames[getFirstDayOfCurrentMonth().getMonth()],
    receipTypeUuid: "",
  });

  const router = useRouter();

  // Función para manejar la confirmación
  const onConfirm = async () => {};

  // Función para reiniciar el estado del formulario
  const resetReceiptForm = () => {
    setReceiptForm({
      date: getFirstDayOfCurrentMonth(),
      period: monthNames[getFirstDayOfCurrentMonth().getMonth()],
      receipTypeUuid: "",
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetReceiptForm(); // Llama a la función para reiniciar el formulario
    }
  };

  return (
    <>

      <DropdownMenu
        modal={false}
        onOpenChange={handleOpenChange}
        open={open}
      >
        <DropdownMenuTrigger asChild>
          <Button className="text-xs md:text-sm">
            <Plus className="mr-2 h-4 w-4" /> Recibo
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Crear recibo</DropdownMenuLabel>
          <NewReceiptUmForm
            receiptForm={receiptForm}
            setReceiptForm={setReceiptForm}
            user={user}
            setOpen={setOpen}
            setRefresh={setRefresh}
          ></NewReceiptUmForm>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

"use client";


import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/constants/User/user";
import {  Plus} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import ReceiptTypeForm from "./receipt-type-form";

export interface ReceiptTypeFrom {
    companyUuid: string;
    name?: string;
    concept?: string;
    price?: number;
    uuid?: string;
}

interface Props{
  user: User | null,
  setRefresh: Dispatch<SetStateAction<number>>
}

export function NewReceiptTypeDialog({user, setRefresh}:Props) {

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [receiptTypeFrom, setReceiptTypeForm] = useState<ReceiptTypeFrom>({
    companyUuid: '',
    name: '',
    concept: '',
    price: 0,
    uuid: '',
  });

  const router = useRouter();

  // Función para manejar la confirmación
  const onConfirm = async () => {};

  // Función para reiniciar el estado del formulario
  const resetForm = () => {
    setReceiptTypeForm({
      companyUuid: '',
      name: '',
      concept: '',
      price: 0,
      uuid: '',
    }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm(); // Llama a la función para reiniciar el formulario
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
            <Plus className="mr-2 h-4 w-4" />Tipo de Recibo
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Crear Tipo de Recibo</DropdownMenuLabel>
          <ReceiptTypeForm receiptTypeForm={receiptTypeFrom} setReceiptTypeForm={setReceiptTypeForm} 
          user={null} setOpen={setOpen} setRefresh={setRefresh}></ReceiptTypeForm>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

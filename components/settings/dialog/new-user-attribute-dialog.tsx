"use client";


import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/constants/User/user";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import CreateUserAttribute from "./create-user-attribute";

export interface CreateUserAttributeForm {
    companyUuid: string;
    name: string;
    question?: string;
}

interface Props{
  user: User | null,
  setRefresh: Dispatch<SetStateAction<number>>
}

export function NewAttributeUserDialog({user, setRefresh}:Props) {

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createUserAttributeForm, setCreateUserAttributeForm] = useState<CreateUserAttributeForm>({
    companyUuid: '',
    name: '',
    question: undefined,
  });

  const router = useRouter();

  // Función para manejar la confirmación
  const onConfirm = async () => {};

  // Función para reiniciar el estado del formulario
  const resetCreateGroupForm = () => {
    setCreateUserAttributeForm({
        companyUuid: '',
        name: '',
        question: undefined,
      });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        resetCreateGroupForm(); // Llama a la función para reiniciar el formulario
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
            <Plus className="mr-2 h-4 w-4" />Atributo
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Crear Atributo</DropdownMenuLabel>
          <CreateUserAttribute createUserAttributeForm={createUserAttributeForm} setCreateUserAttributeForm={setCreateUserAttributeForm} 
          user={null} setOpen={setOpen} setRefresh={setRefresh}></CreateUserAttribute>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

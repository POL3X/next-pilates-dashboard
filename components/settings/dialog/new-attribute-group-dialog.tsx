"use client";


import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/constants/User/user";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import CreateGroupAttribute from "./create-group-attribute";

export interface CreateGroupAttributeForm {
    companyUuid: string;
    title: string;
    color: string;
    description?: string;
}

interface Props{
  user: User | null,
  setRefresh: Dispatch<SetStateAction<number>>
}

export function NewAttributeGroupDialog({user, setRefresh}:Props) {

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createGroupAttributeForm, setCreateGroupAttributeForm] = useState<CreateGroupAttributeForm>({
    companyUuid: '',
    title: '',
    color: '#FFFFFF',
    description: undefined,
  });

  const router = useRouter();

  // Función para manejar la confirmación
  const onConfirm = async () => {};

  // Función para reiniciar el estado del formulario
  const resetCreateGroupForm = () => {
    setCreateGroupAttributeForm({
        companyUuid: '',
        title: '',
        color: '#FFFFFF',
        description: undefined,
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
          <CreateGroupAttribute createGroupAttributeForm={createGroupAttributeForm} setCreateGroupAttributeForm={setCreateGroupAttributeForm} 
          user={null} setOpen={setOpen} setRefresh={setRefresh}></CreateGroupAttribute>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

"use client";


import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { monthNames } from "@/constants/MonthNames";
import { User } from "@/constants/User/user";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import CreateGroupKanban from "../forms/kanban/create-group-kanban";

export interface CreateGroupForm {
  startTime?: Date;
  duration?: Date;
  categoryUuid: string;
  name: string;
  dayOfWeek: string;
  maxUsers: number;
}

interface Props{
  user: User | null,
  setRefresh: Dispatch<SetStateAction<number>>
}

export function NewGroupDialog({user, setRefresh}:Props) {

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createGroupForm, setCreateGroupForm] = useState<CreateGroupForm>({
    startTime: new Date(),
    duration: new Date(),
    categoryUuid: '',
    name: '',
    dayOfWeek: 'Lunes',
    maxUsers: 0,
  });

  const router = useRouter();

  // Función para manejar la confirmación
  const onConfirm = async () => {};

  // Función para reiniciar el estado del formulario
  const resetCreateGroupForm = () => {
    setCreateGroupForm({
        startTime: new Date(),
        duration: new Date(),
        categoryUuid: '',
        name: '',
        dayOfWeek: 'Monday',
        maxUsers: 0,
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
            <Plus className="mr-2 h-4 w-4" />Grupo
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Crear grupo</DropdownMenuLabel>
          <CreateGroupKanban
            createGroupForm={createGroupForm}
            setCreateGroupForm={setCreateGroupForm}
            user={user}
            setOpen={setOpen}
            setRefresh={setRefresh}
          ></CreateGroupKanban>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

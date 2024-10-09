'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { User } from "@/constants/User/user";
import { Button } from "../../ui/button";
import UserSessionContext from "../../layout/context/user-session";
import { useToast } from "@/components/ui/use-toast";
import { CreateGroupForm } from "@/components/kanban/new-group-dialog";
import { Group } from "@/constants/Group/group";
import { TimePickerDemo } from "@/components/ui/time-picker-demo";
import { Input } from "@/components/ui/input";
import { Category } from "@/constants/Category/category";
import { ComboboxCategoryGroup } from "@/components/ui/custom/Kanban/combobox/combobox-category-group";
import { useTaskStore } from "@/lib/store";
import { ComboboxDayOfWeek } from "@/components/ui/custom/Kanban/combobox/combobox-day-of-week";
import { createKanbanGroupAction } from "@/actions/Kanban/createGroupAction";

interface Props {
    createGroupForm: CreateGroupForm,
    setCreateGroupForm: Dispatch<SetStateAction<CreateGroupForm>>
    user: User | null,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setRefresh: Dispatch<SetStateAction<number>>

}

export default function CreateGroupKanban({ createGroupForm, setCreateGroupForm, user, setOpen, setRefresh }: Props) {
    const [categorySelected, setCategorySelected] = useState<Category | null>(null)
    const [startTimePicker, setStartTimePicker] = useState<Date | undefined>()
    const [durationTimePicker, setDurationTimePicker] = useState<Date | undefined>()
    const [daySelected, setDaySelected] = useState<string>('Seleccione un dia')

    const addCol = useTaskStore((state) => state.addCol);

    const userSessionContextType = useContext(UserSessionContext)
    const { toast } = useToast();

    const onClickCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Evita que la página se recargue
        console.log(user)
        if(startTimePicker != undefined && durationTimePicker != undefined){
    
            const newGroup: Group = {
                uuid: '',
                companyUuid: userSessionContextType.userSession?.selectedCompany!,  // Asigna el UUID de la empresa seleccionada
                categoryUuid: categorySelected?.uuid ?? '', // Asigna el UUID de la categoría seleccionada
                name: createGroupForm.name, // Asigna el nombre del grupo desde un formulario, por ejemplo
                dayOfWeek: daySelected, // Asigna el día de la semana seleccionado
                startTime: startTimePicker, // Hora de inicio desde un formulario o selección
                duration: durationTimePicker, // Duración del grupo (horas/minutos)
                maxUsers: createGroupForm.maxUsers, // Número máximo de usuarios permitido
            };
            console.log(newGroup.startTime.toUTCString())
            const groupResponse = await createKanbanGroupAction(newGroup)
            addCol(daySelected, groupResponse)
        }
        setOpen(false)
        setRefresh(Math.random())
        toast({
            variant: 'default',
            title: 'Grupo creado con exito',
            description: 'El grupo ha sido creado con exito'
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCreateGroupForm((prevForm) => ({
            ...prevForm,
            [name]: name === 'maxUsers' ? Number(value) : value,  // Convierte maxUsers a número
        }));
    };
    return (
        <>
            <form>
                <div className="flex flex-col">
                    <Label>Hora de Inicio:</Label>
                    <TimePickerDemo date={startTimePicker} setDate={setStartTimePicker}></TimePickerDemo>
                    <Label>Duración:</Label>
                    <TimePickerDemo date={durationTimePicker} setDate={setDurationTimePicker}></TimePickerDemo>
                    <Label>Día: </Label>
                    <ComboboxDayOfWeek  daySelected={daySelected} setDaySelected={setDaySelected}></ComboboxDayOfWeek>
                    <Label>Categoria: </Label>
                    <ComboboxCategoryGroup user={user} categorySelected={categorySelected} setCategorySelected={setCategorySelected}></ComboboxCategoryGroup>
                    <Label>Nombre</Label>
                    <Input type="text" placeholder="A" name="name" value={createGroupForm.name}  onChange={handleInputChange} ></Input>
                    <Label>Max. Usuarios</Label>
                    <Input type="number" placeholder="0" name="maxUsers" value={createGroupForm.maxUsers}  onChange={handleInputChange} ></Input>
                    <Button onClick={onClickCreate}>Crear Grupo</Button>
                </div>
            </form>
        </>
    );
}

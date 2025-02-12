'use client';

import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Label } from "../../ui/label";
import { User } from "@/constants/User/user";
import { Button } from "../../ui/button";
import UserSessionContext from "../../layout/context/user-session";
import { useToast } from "@/components/ui/use-toast";
import { Group } from "@/constants/Group/group";
import { TimePickerDemo } from "@/components/ui/time-picker-demo";
import { Input } from "@/components/ui/input";
import { Category } from "@/constants/Category/category";
import { ComboboxCategoryGroup } from "@/components/ui/custom/Kanban/combobox/combobox-category-group";
import { useTaskStore } from "@/lib/store";
import { ComboboxDayOfWeek } from "@/components/ui/custom/Kanban/combobox/combobox-day-of-week";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { dayEnglishToSpanish } from "@/constants/DayOfWeek";
import { editGroupAction } from "@/actions/Kanban/editGroupAction";

interface Props {
    editGroupForm: Group,
    setEditGroupForm: Dispatch<SetStateAction<Group>>
    user: User | null,
    setOpen: Dispatch<SetStateAction<boolean>>,
    open: boolean,
    setRefresh: Dispatch<SetStateAction<number>>

}

const capitalizeFirstLetter = (string:string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function EditGroupKanbanDialog({ editGroupForm, setEditGroupForm, user, open, setOpen, setRefresh }: Props) {

    const [hours, minutes, seconds] = editGroupForm.startTime.toString().split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0); 
    const [hoursDuration, minutesDuration, secondsDuration] = editGroupForm.startTime.toString().split(':').map(Number);
    const dateDuration = new Date();
    dateDuration.setHours(hoursDuration, minutesDuration, secondsDuration, 0); 

    const [categorySelected, setCategorySelected] = useState<Category | null>(editGroupForm.category ? editGroupForm.category : null)
    const [startTimePicker, setStartTimePicker] = useState<Date | undefined>(date)
    const [durationTimePicker, setDurationTimePicker] = useState<Date | undefined>(dateDuration)
    const [daySelected, setDaySelected] = useState<string>(capitalizeFirstLetter(dayEnglishToSpanish[editGroupForm.dayOfWeek.toLocaleLowerCase()]))
    //const addCol = useTaskStore((state) => state.addCol);

    const userSessionContextType = useContext(UserSessionContext)
    const { toast } = useToast();
    const formatTimeUTC = (date: Date | undefined): Date => {
        if (!date) return new Date();
        const offset = date.getTimezoneOffset();
        const utcDate = new Date(date.getTime() - offset * 60000);
        return utcDate;
      };
    const onClickCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Evita que la página se recargue
        if (startTimePicker != undefined && durationTimePicker != undefined) {
            const newGroup: Group = {
                uuid: editGroupForm.uuid,
                companyUuid: userSessionContextType.userSession?.selectedCompany!,  // Asigna el UUID de la empresa seleccionada
                categoryUuid: categorySelected?.uuid ?? '', // Asigna el UUID de la categoría seleccionada
                name: editGroupForm.name, // Asigna el nombre del grupo desde un formulario, por ejemplo
                dayOfWeek: daySelected, // Asigna el día de la semana seleccionado
                startTime: formatTimeUTC(startTimePicker), // Hora de inicio desde un formulario o selección
                duration: formatTimeUTC(durationTimePicker), // Duración del grupo (horas/minutos)
                maxUsers: editGroupForm.maxUsers, // Número máximo de usuarios permitido
                userGroup: []
            };
             await editGroupAction(newGroup, newGroup.companyUuid);
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
        setEditGroupForm((prevForm) => ({
            ...prevForm,
            [name]: name === 'maxUsers' ? Number(value) : value,  // Convierte maxUsers a número
        }));
    };
    return (
        <>
            <form>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Editar Grupo
                            </AlertDialogTitle>
                        </AlertDialogHeader>

                        <div className="flex flex-col">
                            <Label>Hora de Inicio:</Label>
                            <TimePickerDemo date={startTimePicker} setDate={setStartTimePicker}></TimePickerDemo>
                            <Label>Duración:</Label>
                            <TimePickerDemo date={durationTimePicker} setDate={setDurationTimePicker}></TimePickerDemo>
                            <Label>Día: </Label>
                            <ComboboxDayOfWeek daySelected={daySelected} setDaySelected={setDaySelected}></ComboboxDayOfWeek>
                            <Label>Categoria: </Label>
                            <ComboboxCategoryGroup user={user} categorySelected={categorySelected} setCategorySelected={setCategorySelected}></ComboboxCategoryGroup>
                            <Label>Nombre</Label>
                            <Input type="text" placeholder="A" name="name" value={editGroupForm.name} onChange={handleInputChange} ></Input>
                            <Label>Max. Usuarios</Label>
                            <Input type="number" placeholder="0" name="maxUsers" value={editGroupForm.maxUsers} onChange={handleInputChange} ></Input>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button onClick={onClickCreate}>Crear Grupo</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent >
                </AlertDialog >
            </form>
        </>
    );
}

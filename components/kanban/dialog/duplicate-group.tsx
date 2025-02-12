'use client';

import { Dispatch, SetStateAction, useContext, useState, useEffect } from "react";
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
import { Task, useTaskStore } from "@/lib/store";
import { ComboboxDayOfWeek } from "@/components/ui/custom/Kanban/combobox/combobox-day-of-week";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { dayEnglishToSpanish } from "@/constants/DayOfWeek";
import { editGroupAction } from "@/actions/Kanban/editGroupAction";
import { ScrollArea } from "@/components/ui/scroll-area";
import { duplicateGroupAction } from "@/actions/Kanban/duplicateGroupAction";
import { Icons } from "@/components/icons";

interface Props {
    duplicateGroupForm: Group,
    setDuplicateGroupForm: Dispatch<SetStateAction<Group>>
    taskColumns: Task[],
    user: User | null,
    setOpen: Dispatch<SetStateAction<boolean>>,
    open: boolean,
    setRefresh: Dispatch<SetStateAction<number>>

}

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function DuplicateGroupKanbanDialog({ duplicateGroupForm, setDuplicateGroupForm, taskColumns, user, open, setOpen, setRefresh }: Props) {

    const [hours, minutes, seconds] = duplicateGroupForm.startTime.toString().split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    const [hoursDuration, minutesDuration, secondsDuration] = duplicateGroupForm.startTime.toString().split(':').map(Number);
    const dateDuration = new Date();
    dateDuration.setHours(hoursDuration, minutesDuration, secondsDuration, 0);

    const [categorySelected, setCategorySelected] = useState<Category | null>(duplicateGroupForm.category ? duplicateGroupForm.category : null)
    const [startTimePicker, setStartTimePicker] = useState<Date | undefined>(date)
    const [durationTimePicker, setDurationTimePicker] = useState<Date | undefined>(dateDuration)
    const [daySelected, setDaySelected] = useState<string>(capitalizeFirstLetter(dayEnglishToSpanish[duplicateGroupForm.dayOfWeek.toLocaleLowerCase()]))
    const addCol = useTaskStore((state) => state.addCol);
    const [taskColumnsCopy, setTaskColumnsCopy] = useState<Task[]>([...taskColumns]);
    const TrashIcon = Icons['trash']
    useEffect(() => {
        setTaskColumnsCopy([...taskColumns]);
    }, [taskColumns]);

    useEffect(() => {
        if (open) {
            setTaskColumnsCopy([...taskColumns]);
            setCategorySelected(duplicateGroupForm.category ? duplicateGroupForm.category : null);
            setStartTimePicker(date);
            setDurationTimePicker(dateDuration);
            setDaySelected(capitalizeFirstLetter(dayEnglishToSpanish[duplicateGroupForm.dayOfWeek.toLocaleLowerCase()]));
        }
    }, [open, taskColumns, duplicateGroupForm]);

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
                uuid: duplicateGroupForm.uuid,
                companyUuid: userSessionContextType.userSession?.selectedCompany!,  // Asigna el UUID de la empresa seleccionada
                categoryUuid: categorySelected?.uuid ?? '', // Asigna el UUID de la categoría seleccionada
                name: duplicateGroupForm.name, // Asigna el nombre del grupo desde un formulario, por ejemplo
                dayOfWeek: daySelected, // Asigna el día de la semana seleccionado
                startTime: formatTimeUTC(startTimePicker), // Hora de inicio desde un formulario o selección
                duration: formatTimeUTC(durationTimePicker), // Duración del grupo (horas/minutos)
                maxUsers: duplicateGroupForm.maxUsers, // Número máximo de usuarios permitido
                userGroup: [] // Use the modified taskColumnsCopy array
            };
            await duplicateGroupAction(newGroup, taskColumnsCopy, newGroup.companyUuid);
        }
        setOpen(false)
        setRefresh(Math.random())
        toast({
            variant: 'default',
            title: 'Grupo duplicado con exito',
            description: 'El grupo ha sido duplicado con exito'
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setDuplicateGroupForm((prevForm) => ({
            ...prevForm,
            [name]: name === 'maxUsers' ? Number(value) : value,  // Convierte maxUsers a número
        }));
    };

    const handleRemoveTask = (uuid: string) => {
        setTaskColumnsCopy((prevTasks) => prevTasks.filter(task => task.uuid !== uuid));
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
                            <Input type="text" placeholder="A" name="name" value={duplicateGroupForm.name} onChange={handleInputChange} ></Input>
                            <Label>Max. Usuarios</Label>
                            <Input type="number" placeholder="0" name="maxUsers" value={duplicateGroupForm.maxUsers} onChange={handleInputChange} ></Input>
                        </div>
                        <Label>Usuarios</Label>
                        <ScrollArea className="flex flex-col mt-4" style={{ maxHeight: '200px' }}>
                            {taskColumnsCopy
                                .filter(task => !task.waitList)
                                .map(task => (
                                    <div key={task.uuid} className="flex justify-between items-center p-2 mb-2 border rounded-lg bg-transparent text-sm/5">
                                        <span>{task.title}</span>
                                        <Button variant={"secondary"} size={"sm"} className="bg-transparent" onClick={() => handleRemoveTask(task.uuid)}><TrashIcon className="size-3"></TrashIcon></Button>
                                    </div>
                                ))}
                            <hr className="my-4" />
                            {taskColumnsCopy
                                .filter(task => task.waitList)
                                .map(task => (
                                    <div key={task.uuid} className="flex justify-between items-center p-2 mb-2 border rounded-lg bg-blue-100 text-sm/5">
                                        <span>{task.title}</span>
                                        <Button variant={"secondary"} size={"sm"} className="bg-transparent" onClick={() => handleRemoveTask(task.uuid)}><TrashIcon className="size-3"></TrashIcon></Button>
                                    </div>
                                ))}
                        </ScrollArea>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <Button onClick={onClickCreate}>Duplicar Grupo</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent >
                </AlertDialog >
            </form>
        </>
    );
}

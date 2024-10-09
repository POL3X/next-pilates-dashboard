'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { User } from "@/constants/User/user";
import { Button } from "../../ui/button";
import UserSessionContext from "../../layout/context/user-session";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { CreateGroupAttributeForm } from "./new-attribute-group-dialog";
import { ColorPicker } from "@/components/ui/color-picker";
import { GroupAttribute } from "@/constants/GroupAttribute/groupAttribute";
import { createGroupAttributeAction } from "@/actions/settings/createGroupAttributeAction";

interface Props {
    createGroupAttributeForm: CreateGroupAttributeForm,
    setCreateGroupAttributeForm: Dispatch<SetStateAction<CreateGroupAttributeForm>>
    user: User | null,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setRefresh: Dispatch<SetStateAction<number>>

}

export default function CreateGroupAttribute({ createGroupAttributeForm, setCreateGroupAttributeForm, user, setOpen, setRefresh }: Props) {
    const userSessionContextType = useContext(UserSessionContext)
    const { toast } = useToast();

    const onClickCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Evita que la página se recargue
        const newGroupAttribute: GroupAttribute = {
            uuid: '',
            companyUuid: userSessionContextType.userSession?.selectedCompany!,
            title: createGroupAttributeForm.title,
            color: createGroupAttributeForm.color,
            description: createGroupAttributeForm.description
        };
        await createGroupAttributeAction(newGroupAttribute)
        setOpen(false)
        setRefresh(Math.random())
        toast({
            variant: 'default',
            title: 'Atrubuto de grupo creado con exito',
            description: 'El atrubuto de grupo ha sido creado con exito'
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCreateGroupAttributeForm((prevForm) => ({
            ...prevForm,
            [name]: name === 'maxUsers' ? Number(value) : value,  // Convierte maxUsers a número
        }));
    };

    const handleColor = (color: string) => {
        setCreateGroupAttributeForm((prevForm) => ({
            ...prevForm,
            color: color,  // Convierte maxUsers a número
        }));
    };

    return (
        <>
            <form>
                <div className="flex flex-col gap-2">
                    <Label>Título</Label>
                    <Input type="text" placeholder="Título" name="title" value={createGroupAttributeForm.title} onChange={handleInputChange} ></Input>
                    <div className="flex flex-row items-center gap-2">
                    <Label>Color:</Label>
                    <ColorPicker value={createGroupAttributeForm.color} onChange={handleColor} name="color"></ColorPicker>
                    </div>
                    <Label>Descripción: (Opcional)</Label>
                    <Input type="text" placeholder="Descripción" name="description" value={createGroupAttributeForm.description} onChange={handleInputChange} ></Input>
                    <Button onClick={onClickCreate}>Crear Atributo</Button>
                </div>
            </form>
        </>
    );
}

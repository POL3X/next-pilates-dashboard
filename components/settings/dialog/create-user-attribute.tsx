'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { User } from "@/constants/User/user";
import { Button } from "../../ui/button";
import UserSessionContext from "../../layout/context/user-session";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { UserAttribute } from "@/constants/UserAttribute/userAttribute";
import { createUserAttributeAction } from "@/actions/settings/createUserAttributeAction";
import { CreateUserAttributeForm } from "./new-user-attribute-dialog";

interface Props {
    createUserAttributeForm: CreateUserAttributeForm,
    setCreateUserAttributeForm: Dispatch<SetStateAction<CreateUserAttributeForm>>
    user: User | null,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setRefresh: Dispatch<SetStateAction<number>>

}

export default function CreateUserAttribute({ createUserAttributeForm, setCreateUserAttributeForm, user, setOpen, setRefresh }: Props) {
    const userSessionContextType = useContext(UserSessionContext)
    const { toast } = useToast();

    const onClickCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Evita que la página se recargue
        const newUserAttribute: UserAttribute = {
            uuid: '',
            companyUuid: userSessionContextType.userSession?.selectedCompany!,
            name: createUserAttributeForm.name,
            question: createUserAttributeForm.question,
        };
        await createUserAttributeAction(newUserAttribute)
        setOpen(false)
        setRefresh(Math.random())
        toast({
            variant: 'default',
            title: 'Atrubuto de usuario creado con exito',
            description: 'El atrubuto de usuario ha sido creado con exito'
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCreateUserAttributeForm((prevForm) => ({
            ...prevForm,
            [name]: name === 'maxUsers' ? Number(value) : value,  // Convierte maxUsers a número
        }));
    };

    const handleColor = (color: string) => {
        setCreateUserAttributeForm((prevForm) => ({
            ...prevForm,
            color: color,  // Convierte maxUsers a número
        }));
    };

    return (
        <>
            <form>
                <div className="flex flex-col gap-2">
                    <Label>Nombre</Label>
                    <Input type="text" placeholder="Nombre del atributo" name="name" value={createUserAttributeForm.name} onChange={handleInputChange} ></Input>
                    <Label>Pregunta: (Opcional)</Label>
                    <Input type="text" placeholder="Pregunta para el usurio" name="question" value={createUserAttributeForm.question} onChange={handleInputChange} ></Input>
                    <Button onClick={onClickCreate}>Crear Atributo</Button>
                </div>
            </form>
        </>
    );
}

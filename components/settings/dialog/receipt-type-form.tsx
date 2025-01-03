'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { User } from "@/constants/User/user";
import { Button } from "../../ui/button";
import UserSessionContext from "../../layout/context/user-session";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import type { ReceiptTypeFrom } from "./new-receipt-type-dialog";
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType";
import { createReceiptTypeAction } from "@/actions/settings/receiptType/createReceiptTypeAction";

interface Props {
    receiptTypeForm: ReceiptTypeFrom,
    setReceiptTypeForm: Dispatch<SetStateAction<ReceiptTypeFrom>>
    user: User | null,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setRefresh: Dispatch<SetStateAction<number>>

}

export default function ReceiptTypeFrom({receiptTypeForm, setReceiptTypeForm, user, setOpen, setRefresh }: Props) {
    const userSessionContextType = useContext(UserSessionContext)
    const { toast } = useToast();

    const onClickCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Evita que la página se recargue
        const newReceiptType: ReceiptType = {
            uuid: '',
            name: receiptTypeForm.name,
            concept: receiptTypeForm.concept,
            price: receiptTypeForm.price,
        };
        await createReceiptTypeAction(receiptTypeForm, userSessionContextType.userSession?.selectedCompany!)
        setOpen(false)
        setRefresh(Math.random())
        toast({
            variant: 'default',
            title: 'Tipo de recibo creado con exito',
            description: 'El tipo de recibo ha sido creado con exito'
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setReceiptTypeForm((prevForm) => ({
            ...prevForm,
            [name]: name === 'price' ? Number(value) : value,  // Convierte maxUsers a número
        }));
    };

    return (
        <>
            <form>
                <div className="flex flex-col gap-2">
                    <Label>Nombre</Label>
                    <Input type="text" placeholder="Nombre " name="name" value={receiptTypeForm.name} onChange={handleInputChange} ></Input>
                    <Label>Concepto</Label>
                    <Input type="text" placeholder="Concepto" name="concept" value={receiptTypeForm.concept} onChange={handleInputChange} ></Input>
                    <Label>Precio</Label>
                    <Input type="number" placeholder="Precio" name="price" value={receiptTypeForm.price} onChange={handleInputChange} ></Input>
                    <Button onClick={onClickCreate}>Crear tipo de recibo</Button>
                </div>
            </form>
        </>
    );
}

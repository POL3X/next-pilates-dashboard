import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Dispatch, SetStateAction, useState } from "react";
import { CheckIcon, PencilIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType";
import { deleteReceiptTypeAction } from "@/actions/settings/receiptType/deleteReceiptTypeAction";
import { editReceiptTypeAction } from "@/actions/settings/receiptType/editReceiptTypeAction";

interface Props {
    receiptType: ReceiptType,
    companyUuid: string,
    setRefresh: Dispatch<SetStateAction<number>>
}

export function ReceiptTypeItem({ receiptType, companyUuid, setRefresh }: Props) {
    const TrashIcon = Icons['trash']
    const CancelIcon = Icons['close']
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputLabel, setInputLabel] = useState<string | undefined>(receiptType.name)
    const [inputConcept, setInputConcept] = useState<string | undefined>(receiptType?.concept)
    const [inputPrice, setInputPrice] = useState<number | undefined>(receiptType?.price)

    const onClickDelete = async (receiptTypeUuid: string) => {
        await deleteReceiptTypeAction(receiptTypeUuid, companyUuid)
        setRefresh(Math.random())
    }
    const handleEditSave = async () => {
        if (isEditing) {
            await editReceiptTypeAction(receiptType.uuid,inputLabel,inputConcept,inputPrice,companyUuid);
            setRefresh(Math.random)
        }
        setIsEditing(!isEditing)
    }
    return (
        <><div className="flex flex-row items-center justify-between gap-2 max-w-[600px]">
            <div className="flex flex-col gap-2">
                {!isEditing ?
                    <><p className="font-bold">{receiptType.name}</p>
                        <p className="text-sm">{receiptType.concept}</p>
                        <p className="text-sm">{receiptType.price} €</p></> :
                    <>
                        <Input type="text" value={inputLabel} onChange={(event) => setInputLabel(event.target.value)}></Input>
                        <Input type="text" value={inputConcept} onChange={(event) => setInputConcept(event.target.value)}></Input>
                        <Input type="number" value={inputPrice} onChange={(event) => setInputPrice(Number(event.target.value))}></Input>

                    </>
                }
            </div>
            <div>
                {isEditing ?
                    <Button variant="ghost" size="icon" className="!mt-0" onClick={()=> {
                        setIsEditing(false)
                        setInputLabel(receiptType.name)
                        setInputConcept(receiptType.concept)
                        setInputPrice(receiptType.price)
                    }}>
                        <CancelIcon className="h-4 w-4"></CancelIcon>
                    </Button> : <></>}
                <Button variant="ghost" size="icon" className="!mt-0" onClick={handleEditSave}>
                    {isEditing ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)}>
                    <TrashIcon className="h-4 w-4"></TrashIcon>
                </Button>
            </div>


        </div><AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Seguro que quieres eliminar el tipo de recibo?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            NOTE: Los usuarios con que este tipo de recibo dejarán de tenerlo asignado.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                // yes, you have to set a timeout
                                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                                onClickDelete(receiptType.uuid)
                                setShowDeleteDialog(false);
                                toast({
                                    description: 'Tipo de recibo eliminado'
                                });
                            }}
                        >
                            Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog></>
    )
}
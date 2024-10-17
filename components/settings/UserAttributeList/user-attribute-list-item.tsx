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
import { UserAttribute } from "@/constants/UserAttribute/userAttribute";
import { deleteUserAttributeAction } from "@/actions/settings/deleteUserAttributeAction";
import { CheckIcon, PencilIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateUserAttributeAction } from "@/actions/settings/updateUserAttributeAction";

interface Props {
    userAttribute: UserAttribute,
    companyUuid: string,
    setRefresh: Dispatch<SetStateAction<number>>
}

export function UserAttributeItem({ userAttribute, companyUuid, setRefresh }: Props) {
    const TrashIcon = Icons['trash']
    const CancelIcon = Icons['close']
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputLabel, setInputLabel] = useState<string>(userAttribute.name)
    const [inputQuestion, setInputQuestion] = useState<string | undefined>(userAttribute?.question)
    const onClickDelete = async (groupAttributeUuid: string) => {
        await deleteUserAttributeAction(groupAttributeUuid, companyUuid)
        setRefresh(Math.random())
    }
    const handleEditSave = async () => {
        if (isEditing) {
            await updateUserAttributeAction(userAttribute.uuid, inputLabel,inputQuestion,companyUuid)
            setRefresh(Math.random)
        }
        setIsEditing(!isEditing)
    }
    return (
        <><div className="flex flex-row items-center justify-between gap-2 max-w-[600px]">
            <div className="flex flex-col gap-2">
                {!isEditing ?
                    <><p className="font-bold">{userAttribute.name}</p>
                        <p className="text-sm">{userAttribute.question}</p></> :
                    <>
                        <Input type="text" value={inputLabel} onChange={(event) => setInputLabel(event.target.value)}></Input>
                        <Input type="text" value={inputQuestion} onChange={(event) => setInputQuestion(event.target.value)}></Input>
                    </>
                }
            </div>
            <div>
                {isEditing ?
                    <Button variant="ghost" size="icon" className="!mt-0" onClick={()=> {
                        setIsEditing(false)
                        setInputLabel(userAttribute.name)
                        setInputQuestion(userAttribute.question)
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
                            ¿Seguro que quieres eliminar el atributo de usuario?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            NOTE: Este atributo se eliminará de los usuarios asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                // yes, you have to set a timeout
                                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                                onClickDelete(userAttribute.uuid)
                                setShowDeleteDialog(false);
                                toast({
                                    description: 'This column has been deleted.'
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
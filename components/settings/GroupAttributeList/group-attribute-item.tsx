import { deleteGroupAttributeAction } from "@/actions/settings/deleteGroupAttributeAction";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { GroupAttribute } from "@/constants/GroupAttribute/groupAttribute"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
  } from '@/components/ui/alert-dialog';import { Dispatch, SetStateAction, useState } from "react";

interface Props {
    groupAttribute: GroupAttribute,
    companyUuid: string,
    setRefresh:  Dispatch<SetStateAction<number>>
}

export function GroupAttributeItem({ groupAttribute, companyUuid, setRefresh }: Props) {
    const TrashIcon = Icons['trash']
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const onClickDelete = async (groupAttributeUuid: string) => {
        await deleteGroupAttributeAction(groupAttributeUuid, companyUuid)
        setRefresh(Math.random())
    }

    return (
        <><div key={groupAttribute.uuid} className="flex flex-row items-center justify-between gap-2 max-w-[300px]">
            <div className="flex flex-row gap-2 items-center">
                <Button
                    className="block !opacity-100"
                    size='icon'
                    style={{
                        backgroundColor: groupAttribute.color,
                    }}
                    variant='outline'
                    disabled
                >
                    <div />
                </Button>
                <p>{groupAttribute.title}</p>
            </div>
            <Button className="bg-transparent" onClick={()=>setShowDeleteDialog(true)}>
                <TrashIcon></TrashIcon>
            </Button>
        </div><AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                           ¿Seguro que quieres eliminar el tag de grupo?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            NOTE: Este atributo se eliminará de los grupos asociaos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                // yes, you have to set a timeout
                                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                                onClickDelete(groupAttribute.uuid)
                                setShowDeleteDialog(false);
                                toast({
                                    description: 'This column has been deleted.'
                                });
                            } }
                        >
                            Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog></>
    )
}
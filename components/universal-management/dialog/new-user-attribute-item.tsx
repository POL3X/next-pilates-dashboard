import { Card, CardContent, CardHeader } from "../../ui/card"
import { UserUserAttribute } from "@/constants/UserUserAttribute/userUserAttribute"
import { Dispatch, SetStateAction, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckIcon, PencilIcon } from "lucide-react"
import { Icons } from "@/components/icons"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface Props {
    userUserAttribute: UserUserAttribute,
    companyUuid?: string,
    setNewUserAttributeList: Dispatch<SetStateAction<UserUserAttribute[]>>

}

export function NewUserAttributeItem({ userUserAttribute, companyUuid, setNewUserAttributeList}: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [inputValue, setInputValue] = useState<string>(userUserAttribute.value)
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
    const XIcon = Icons['close']
    const TrashIcon = Icons['trash']

    const handleEditSave = async () => {
        if(isEditing){
            setNewUserAttributeList((prevList) =>
                prevList.map((attribute) =>
                  attribute.userAttributeUuid === userUserAttribute.userAttributeUuid ? { ...attribute, value: inputValue } : attribute
                )
              );         
        }
        setIsEditing(!isEditing)
    }

    const deleteUserUserAttribute = async () => {
        setNewUserAttributeList((prevList) =>
            prevList.filter((attribute) => attribute.userAttributeUuid !== userUserAttribute.userAttributeUuid)
          );       
        }

    return (<>
        <Card className="w-[300px]">
            <CardHeader className="flex flex-row justify-end p-0">
                {isEditing ?
                    <Button variant="ghost" size="icon" onClick={()=>{
                        setIsEditing(!isEditing)
                        setInputValue(userUserAttribute.value)
                    }}><XIcon className="h-4 w-4"></XIcon></Button> :
                    <Button variant="ghost" size="icon" onClick={()=>setShowDeleteDialog(!showDeleteDialog)}><TrashIcon className="h-4 w-4"></TrashIcon></Button>
                }
                <Button variant="ghost" size="icon" onClick={handleEditSave} className="!mt-0">
                    {isEditing ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent>
                <p>{userUserAttribute?.userAttribute.name}</p>
                {!isEditing ? <p className="text-sm break-words overflow-hidden text-ellipsis">{userUserAttribute?.value}</p> : <Input type="text" value={inputValue} onChange={(event) => setInputValue(event.target.value)}></Input>}
            </CardContent>
        </Card>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                           ¿Seguro que quieres eliminar el atributo del usuario?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            NOTE: Este atributo se eliminará del usuario asociado.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                // yes, you have to set a timeout
                                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                                deleteUserUserAttribute()
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
            </AlertDialog>
    </>)
}
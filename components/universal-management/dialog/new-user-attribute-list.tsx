import { UserUserAttribute } from "@/constants/UserUserAttribute/userUserAttribute"
import { Icons } from "../../icons"
import { Button } from "../../ui/button"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog"
import { toast } from "../../ui/use-toast"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { ComboboxUserAttribute } from "../../ui/custom/universal-management/combobox/combobox-user-attribute"
import { UserAttribute } from "@/constants/UserAttribute/userAttribute"
import { Input } from "../../ui/input"
import UserSessionContext from "../../layout/context/user-session"
import { NewUserAttributeItem } from "./new-user-attribute-item"

interface Props {
    newUserAttributeList: UserUserAttribute[],
    setNewUserAttributeList: Dispatch<SetStateAction<UserUserAttribute[]>>
}

export function NewUserAttributeList({ newUserAttributeList,setNewUserAttributeList}: Props) {
    const user = null;
    const PlusIcon = Icons['add']
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userAtrtibuteSelected, setUserAttributeSelected] = useState<UserAttribute | null>(null)
    const [value, setValue] = useState<string>('')
    const userSessionContextType = useContext(UserSessionContext)

    const onInputChange = (value: string)=> {
        setValue(value)
    }

    const createUserUserAttribute = async () => {
            const userUserAttribute = {
                userUuid: '',
                userAttributeUuid: userAtrtibuteSelected?.uuid ? userAtrtibuteSelected?.uuid : '',
                value: value,
                userAttribute: userAtrtibuteSelected
            } as UserUserAttribute
            setNewUserAttributeList((prevList) => [...prevList, userUserAttribute]);
            setUserAttributeSelected(null)
            setValue('')
        
    }
    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            // Reset values when dialog closes
            setUserAttributeSelected(null)
            setValue('')
        }
        setShowDeleteDialog(isOpen)
    }
    return (
        <>
            <div className="flex flex-row gap-2 items-center">
                {newUserAttributeList?.map((uuA, index) => {
                    return (<div key={index +'-'+ Math.random()}>
                        <NewUserAttributeItem  userUserAttribute={uuA} companyUuid={userSessionContextType.userSession?.selectedCompany} setNewUserAttributeList={setNewUserAttributeList}></NewUserAttributeItem>
                    </div>)
                })}
                <Button size='icon' onClick={() => setShowDeleteDialog(!showDeleteDialog)}><PlusIcon></PlusIcon></Button>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={handleDialogChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Crear nuevo atributo de usuario
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <ComboboxUserAttribute user={user} userAttributeSelected={userAtrtibuteSelected} setUserAttributeSelected={setUserAttributeSelected} exludeUserAttributeUuid={newUserAttributeList?.map((uuA) => {
                        return uuA.userAttribute.uuid
                    })}></ComboboxUserAttribute>
                   { userAtrtibuteSelected ? <Input type="text" value={value} onChange={(event) => onInputChange(event.target.value)}></Input> : <></>}
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                // yes, you have to set a timeout
                                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                                setShowDeleteDialog(false);
                                createUserUserAttribute()
                                toast({
                                    description: 'Atributo creado con exito'
                                });
                            }}
                        >
                            Crear
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog></>
    )
}
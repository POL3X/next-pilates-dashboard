import { UserUserAttribute } from "@/constants/UserUserAttribute/userUserAttribute"
import { UserAttributeItem } from "./user-attribute-item"
import { Icons } from "../../icons"
import { Button } from "../../ui/button"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog"
import { toast } from "../../ui/use-toast"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { ComboboxUserAttribute } from "../../ui/custom/universal-management/combobox/combobox-user-attribute"
import { UserAttribute } from "@/constants/UserAttribute/userAttribute"
import { User } from "@/constants/User/user"
import { Input } from "../../ui/input"
import { createUserUserAttributeAction } from "@/actions/universal-management/userAttribute/createUserUserAttributeAction"
import UserSessionContext from "../../layout/context/user-session"

interface Props {
    userUserAttributeList?: UserUserAttribute[],
    user: User | null,
    setRefresh: Dispatch<SetStateAction<number>>
}

export function UserAttributeList({ userUserAttributeList, user, setRefresh }: Props) {
    const PlusIcon = Icons['add']
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userAtrtibuteSelected, setUserAttributeSelected] = useState<UserAttribute | null>(null)
    const [value, setValue] = useState<string>('')
    const userSessionContextType = useContext(UserSessionContext)

    const onInputChange = (value: string) => {
        setValue(value)
    }

    const createUserUserAttribute = async () => {
        const userUserCreated = await createUserUserAttributeAction({
            userUuid: user?.uuid ? user.uuid : '',
            userAttributeUuid: userAtrtibuteSelected?.uuid ? userAtrtibuteSelected?.uuid : '',
            value: value
        } as UserUserAttribute, userSessionContextType.userSession?.selectedCompany)

        if (userUserCreated) {
            setRefresh(Math.random)
            setUserAttributeSelected(null)
            setValue('')
        }
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
            <div className="flex flex-col gap-2 ">
                {userUserAttributeList
                    ?.filter(uuA => uuA && uuA.userUuid) // Filtra los elementos válidos
                    .map((uuA, index) => (
                        <UserAttributeItem
                            key={index + uuA.userUuid}
                            userUserAttribute={uuA}
                            companyUuid={userSessionContextType.userSession?.selectedCompany}
                            setRefresh={setRefresh}
                        />
                    ))}
                <div className="flex items-center">
                    <Button size='icon' onClick={() => setShowDeleteDialog(!showDeleteDialog)}><PlusIcon></PlusIcon></Button>
                </div>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={handleDialogChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Crear nuevo atributo de usuario
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <ComboboxUserAttribute user={user} userAttributeSelected={userAtrtibuteSelected} setUserAttributeSelected={setUserAttributeSelected} exludeUserAttributeUuid={user?.userUserAttribute
        ?.filter(uuA => uuA?.userAttribute?.uuid) // Filtra elementos válidos
        .map((uuA) => uuA.userAttribute.uuid) // Mapea solo si es válido
    }></ComboboxUserAttribute>
                    {userAtrtibuteSelected ? <Input type="text" value={value} onChange={(event) => onInputChange(event.target.value)}></Input> : <></>}
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
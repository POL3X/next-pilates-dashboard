import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ComboboxReceiptType } from "@/components/ui/custom/universal-management/combobox/combobox-receipt-type";
import { ComboboxUserCompanyRol } from "@/components/ui/custom/universal-management/combobox/combobox-user-company-rol";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyRole } from "@/constants/CompanyRole/CompanyRole";
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { UserUserAttribute } from "@/constants/UserUserAttribute/userUserAttribute";
import { NewUserAttributeList } from "./new-user-attribute-list";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createUserAction } from "@/actions/universal-management/createUserAction";
import UserSessionContext from "@/components/layout/context/user-session";
import { User } from "@/constants/User/user";

interface Prop {
    showCreateUserDialog: boolean,
    setShowCreateUserDialog: Dispatch<SetStateAction<boolean>>
    setUserRowSelected: Dispatch<SetStateAction<User | null>>

}

export function CreateUserDialog({ showCreateUserDialog, setShowCreateUserDialog, setUserRowSelected }: Prop) {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phoneNumber: ''
    })
    const [userCompanyRolSelected, setUserRolSelected] = useState<CompanyRole | null>(null)
    const [receiptTypSelected, setReceiptTypSelected] = useState<ReceiptType | null>(null)
    const [newUserAttributeList, setNewUserAttributeList] = useState<UserUserAttribute[]>([])

    const userSession = useContext(UserSessionContext)
    const handleDialogChange = (value: boolean) => {
        setShowCreateUserDialog(value)
        if(value == false){
            setFormData({ name: '',
                surname: '',
                email: '',
                phoneNumber: ''})
            setReceiptTypSelected(null)
            setUserRolSelected(null)
            setNewUserAttributeList([])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        if(!userCompanyRolSelected){
            return
        }
        const userCreated = await createUserAction(formData,userCompanyRolSelected,receiptTypSelected , newUserAttributeList, userSession.userSession?.selectedCompany)
        // Resetear el formulario después del envío
        setUserRowSelected(userCreated)
        setFormData({  name: '',
            surname: '',
            email: '',
            phoneNumber: '' })
        handleDialogChange(false)
    }

    return (
        <>
            <AlertDialog open={showCreateUserDialog} onOpenChange={handleDialogChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Crear nuevo atributo de usuario
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="surname">Apellidos</Label>
                                <Input
                                    id="surname"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Teléfono</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="userCompanyRol">Rol de usuario</Label>
                                <ComboboxUserCompanyRol setUserCompanyRolSelected={setUserRolSelected} userCompanyRolSelected={userCompanyRolSelected}></ComboboxUserCompanyRol>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="receiptType">Tipo de recibo</Label>
                                <ComboboxReceiptType user={null} setReceiptTypeSelected={setReceiptTypSelected} ></ComboboxReceiptType>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="userCompanyRol">Atributos de usuario</Label>
                                <ScrollArea className=' w-[100%] '>
                                    <NewUserAttributeList newUserAttributeList={newUserAttributeList} setNewUserAttributeList={setNewUserAttributeList}></NewUserAttributeList>
                                    <ScrollBar orientation='horizontal'></ScrollBar>
                                </ScrollArea>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                variant="destructive"
                                onClick={handleSubmit}
                            >
                                Crear
                            </Button>
                        </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
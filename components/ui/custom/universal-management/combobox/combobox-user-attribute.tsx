"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import UserSessionContext from "@/components/layout/context/user-session"
import { User } from "@/constants/User/user"
import { Dispatch, SetStateAction } from "react"
import { Category } from "@/constants/Category/category"
import { UserAttribute } from "@/constants/UserAttribute/userAttribute"
import { userAttributeListAction } from "@/actions/settings/userAttributeListAction"

interface Props {
    user: User | null,
    userAttributeSelected: UserAttribute | null;
    setUserAttributeSelected: Dispatch<SetStateAction<UserAttribute | null>>;
    exludeUserAttributeUuid: string[] | undefined;
}

export function ComboboxUserAttribute({ user, userAttributeSelected, setUserAttributeSelected, exludeUserAttributeUuid }: Props) {
    const [open, setOpen] = React.useState(false)
    const [defaultCompany, setDefaultCompany] = React.useState("")
    const [userAttributeList, setUserAttributeList] = React.useState<Category[]>()
    const [value, setValue] = React.useState("")

    const userSessionContextType = React.useContext(UserSessionContext)

    React.useEffect(() => {
        const getDefaultCompany = async () => {
            const defaultCompany = userSessionContextType.userSession?.selectedCompany
            if (defaultCompany) {
                setDefaultCompany(defaultCompany)
                const userAttribute = await userAttributeListAction(defaultCompany, exludeUserAttributeUuid ? exludeUserAttributeUuid : [])
                setUserAttributeList(userAttribute)

            }
        }
        getDefaultCompany()
    }, [userSessionContextType.userSession, user])

    const handleSelect = (currentValue: string | null) => {
        if (currentValue == null) {
            setUserAttributeSelected(null)
            setValue("");
            setOpen(false);
            return
        }
        if (currentValue !== value) {
            setValue(currentValue);
            const userAttributeSelected = userAttributeList?.find((userAttribute) => {
                return userAttribute.uuid == currentValue
            })
            if (userAttributeSelected) {
                setUserAttributeSelected(userAttributeSelected)
                console.log(userAttributeSelected)
            }
        } else if (userAttributeList && userAttributeList.length > 1) {
            // Verifica que receiptTypeData no sea undefined antes de acceder a length
            setUserAttributeSelected(null)
            setValue("");

        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {userAttributeSelected?.name == undefined ? 'Seleccione atributo' : userAttributeSelected?.name}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No existen Categorias</CommandEmpty>
                        <CommandGroup>
                            {userAttributeList?.map((userAttribute) => (
                                <CommandItem
                                    key={userAttribute.uuid}
                                    value={userAttribute.uuid}
                                    onSelect={() => handleSelect(userAttribute.uuid)}
                                >
                                    {userAttribute.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
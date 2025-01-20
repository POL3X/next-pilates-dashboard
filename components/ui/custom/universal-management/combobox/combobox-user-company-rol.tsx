"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Dispatch, SetStateAction } from "react"
import { CompanyRole } from "@/constants/CompanyRole/CompanyRole"
import { companyRolList } from "@/constants/CompanyRole/company-rol-type"

interface Props {
    userCompanyRolSelected: CompanyRole | null
    setUserCompanyRolSelected: Dispatch<SetStateAction<CompanyRole | null>>
}

export function ComboboxUserCompanyRol({ userCompanyRolSelected ,setUserCompanyRolSelected }: Props) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const handleSelect = (currentValue: string | null) => {
        if (currentValue == null) {
            setUserCompanyRolSelected(null)
            setValue("");
            setOpen(false);
            return
        }
        if (currentValue !== value) {
            setValue(currentValue);
            const companyRolSelected = companyRolList?.find((companyRol) => {
                return companyRol.uuid == currentValue
            })
            if (companyRolSelected) {
                setUserCompanyRolSelected(companyRolSelected)
            }
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
                        {userCompanyRolSelected == undefined ? 'Seleccione Rol' : userCompanyRolSelected.description}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>         
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No existen Tipos de recibo</CommandEmpty>
                        <CommandGroup>
                            {companyRolList?.map((companyRol) => (
                                <CommandItem
                                    key={companyRol.uuid}
                                    value={companyRol.uuid}
                                    onSelect={() => handleSelect(companyRol.uuid)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === companyRol.uuid ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {companyRol.description}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
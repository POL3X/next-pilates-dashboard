"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSidebar } from "@/hooks/useSidebar"
import { Icons } from "@/components/icons"
import UserSessionContext from "@/components/layout/context/user-session"
import { getDefaultCompanyCookie } from "@/actions/cookies/cookiesAction"

export function ComboboxNavbar() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { isMinimized, toggle } = useSidebar();
  const Icon = Icons['dashboard'];
  const userSessionContextType = React.useContext(UserSessionContext)
  
  React.useEffect(()=>{
    const getDefaultCompany = async () =>{
        const defaultCompany = userSessionContextType.userSession?.selectedCompany
        if(defaultCompany){
            setValue(defaultCompany)
        }
    }
    getDefaultCompany()
  },[userSessionContextType.userSession])

  // Función para manejar la selección de un item
  const handleSelect = (currentValue: string) => {
    // Verifica que `userSession` y `userSession.company` no sean undefined
    if (userSessionContextType.userSession && userSessionContextType.userSession.company) {
      if (currentValue !== value) {
        // Permite la selección si es un item diferente
        setValue(currentValue);
      } else if (userSessionContextType.userSession.company.length > 1) {
        // Si hay más de un elemento en la lista, permite cambiar el valor a vacío
        setValue("");
      }
  
      // Cierra el Popover
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
       {!isMinimized ? 
       <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? userSessionContextType.userSession?.company.find((company) => company.uuid === value)?.name
            : "Selecciona Compañia"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button> : 
         <Button
         variant="outline"
         role="combobox"
         aria-expanded={open}
         className=
            'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
         
       >
        <Icon></Icon>
        </Button> 
        }
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {userSessionContextType.userSession?.company.map((company) => (
                <CommandItem
                  key={company.uuid}
                  value={company.uuid}
                  onSelect={() => handleSelect(company.uuid)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === company.uuid ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {company.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

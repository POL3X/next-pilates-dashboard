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
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType"
import { receiptTypeListUmAction } from "@/actions/universal-management/receipt-type/receipt-type-list"
import { User } from "@/constants/User/user"
import { Dispatch, SetStateAction } from "react"

interface Props {
  user: User | null,
  setReceiptTypeSelected: Dispatch<SetStateAction<ReceiptType | null>>
}

export function ComboboxReceiptType({user, setReceiptTypeSelected}: Props) {
  const [open, setOpen] = React.useState(false)
  const [defaultCompany, setDefaultCompany] = React.useState("")
  const [receiptTypeData, setReceiptTypeData] = React.useState<ReceiptType[]>()
  const [value, setValue] = React.useState("")
  const { isMinimized, toggle } = useSidebar();
  const Icon = Icons['dashboard'];
  const userSessionContextType = React.useContext(UserSessionContext)
  
  React.useEffect(()=>{
    const getDefaultCompany = async () =>{
        const defaultCompany = userSessionContextType.userSession?.selectedCompany
        if(defaultCompany){
          setDefaultCompany(defaultCompany)
          const receiptList = await receiptTypeListUmAction(defaultCompany)
          setReceiptTypeData(receiptList)
          const exist = receiptList.some((receiptType) =>{
            return receiptType.uuid === user?.userCompany?.[0].receiptType?.uuid
          })
          setValue(exist ? user?.userCompany?.[0]?.receiptType?.uuid ?? '' : '');
          if(exist){
            const userReceipt = receiptList.find((receipt) => {
              return receipt.uuid == user?.userCompany?.[0]?.receiptType?.uuid
            })
            setReceiptTypeSelected(userReceipt ? userReceipt : null)
          }
        }
    }
    getDefaultCompany()
  },[userSessionContextType.userSession, user])

  const handleSelect = (currentValue: string | null) => {
    if(currentValue == null){
      setReceiptTypeSelected(null)
      setValue("");
      setOpen(false);
      return
    }
    if (currentValue !== value) {
      setValue(currentValue);
      const receiptSelected = receiptTypeData?.find((receipt) => {
        return receipt.uuid == currentValue
      })
      if(receiptSelected){
        setReceiptTypeSelected(receiptSelected)
      }
    } else if (receiptTypeData && receiptTypeData.length > 1) {
      // Verifica que receiptTypeData no sea undefined antes de acceder a length
      setReceiptTypeSelected(null)
      setValue("");
      
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
     <PopoverTrigger asChild>
  {!isMinimized ? (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-[200px] justify-between"
    >
      {value
        ? receiptTypeData?.find((type) => type.uuid === value)?.name || "Personalizado"
        : "Personalizado"}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  ) : (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
    >
      <Icon />
    </Button>
  )}
</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No existen Tipos de recibo</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="custom"
                value=""
                onSelect={() => handleSelect(null)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "" ? "opacity-100" : "opacity-0"
                  )}
                />
                Personalizado
              </CommandItem>
              {receiptTypeData?.map((receiptType) => (
                <CommandItem
                  key={receiptType.uuid}
                  value={receiptType.uuid}
                  onSelect={() => handleSelect(receiptType.uuid)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === receiptType.uuid ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {receiptType.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
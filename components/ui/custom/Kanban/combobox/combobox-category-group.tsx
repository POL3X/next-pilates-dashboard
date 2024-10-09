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
import { Category } from "@/constants/Category/category"
import { categoryListAction } from "@/actions/Kanban/categoryListAction"

interface Props {
  user: User | null,
  categorySelected: Category | null;
  setCategorySelected: Dispatch<SetStateAction<Category | null>>
}

export function ComboboxCategoryGroup({user,categorySelected,setCategorySelected}: Props) {
  const [open, setOpen] = React.useState(false)
  const [defaultCompany, setDefaultCompany] = React.useState("")
  const [categoryList, setCategoryList] = React.useState<Category[]>()
  const [value, setValue] = React.useState("")
  const { isMinimized, toggle } = useSidebar();
  const Icon = Icons['dashboard'];
  const userSessionContextType = React.useContext(UserSessionContext)
  
  React.useEffect(()=>{
    const getDefaultCompany = async () =>{
        const defaultCompany = userSessionContextType.userSession?.selectedCompany
        if(defaultCompany){
          setDefaultCompany(defaultCompany)
          const categoryList = await categoryListAction(defaultCompany)
          setCategoryList(categoryList)
         

        }
    }
    getDefaultCompany()
  },[userSessionContextType.userSession, user])

  const handleSelect = (currentValue: string | null) => {
    if(currentValue == null){
      setCategorySelected(null)
      setValue("");
      setOpen(false);
      return
    }
    if (currentValue !== value) {
      setValue(currentValue);
      const receiptSelected = categoryList?.find((category) => {
        return category.uuid == currentValue
      })
      if(receiptSelected){
        setCategorySelected(receiptSelected)
      }
    } else if (categoryList && categoryList.length > 1) {
      // Verifica que receiptTypeData no sea undefined antes de acceder a length
      setCategorySelected(null)
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
      {categorySelected?.name == undefined ? 'Seleccione categoría' : categorySelected?.name}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No existen Categorias</CommandEmpty>
            <CommandGroup>
              {categoryList?.map((category) => (
                <CommandItem
                  key={category.uuid}
                  value={category.uuid}
                  onSelect={() => handleSelect(category.uuid)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.uuid ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
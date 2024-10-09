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
import { Dispatch, SetStateAction } from "react"
import { dayNames } from "@/constants/DayOfWeek"

interface Props {
  daySelected: string;
  setDaySelected: Dispatch<SetStateAction<string>>
}

export function ComboboxDayOfWeek({daySelected,setDaySelected}: Props) {
  const [open, setOpen] = React.useState(false)
  const [daysOfWeek, setDaysOfWeek] = React.useState<string[]>(dayNames)
  const [value, setValue] = React.useState("")
  const { isMinimized, toggle } = useSidebar();
  const Icon = Icons['dashboard'];
  
  const handleSelect = (currentValue: string) => {
    setDaySelected(currentValue)
    setValue(currentValue)
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
      {daySelected}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  
</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No existen días</CommandEmpty>
            <CommandGroup defaultValue={'Lunes'}>
              {daysOfWeek?.map((day, index) => (
                <CommandItem
                  key={day}
                  value={day}
                  onSelect={() => handleSelect(day)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === day ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {day}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
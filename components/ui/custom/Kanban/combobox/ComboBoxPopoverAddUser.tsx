"use client"

import * as React from "react"
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  XCircle,
} from "lucide-react"

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
import { Icons } from "@/components/icons"
import { Task, useTaskStore } from "@/lib/store"
import { findUserByNamePopoverAction } from "@/actions/Kanban/findUserByNamePopoverAction"
import UserSessionContext from "@/components/layout/context/user-session"
import { useEffect, useState } from "react"
import { User } from "@/constants/User/user"
import { changeUserGroupAction } from "@/actions/Kanban/changeUserGroupAction"
import { useSortable } from "@dnd-kit/sortable"
import { Checkbox } from "@/components/ui/checkbox"
import { eventNames } from "process"
import { Accordion } from "@/components/ui/accordion"
import { AccordionItem } from "@radix-ui/react-accordion"


export function ComboboxPopoverAddUser({taskColumns,groupUuid, setRefresh}:{taskColumns: Task[], groupUuid:string, setRefresh:React.Dispatch<React.SetStateAction<number>>}) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<User | null>(
    null
  )
  const [inputName, setInputName] = React.useState<string>('')
  const [userListPopover, setUserListPopover] = useState<User[]>()
  const [companyRole, setCompanyRole] = useState<string>('CLIENT')
  const [inWaitList, setInWaitList] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const userSessionContextType = React.useContext(UserSessionContext)
  const addTask = useTaskStore((state) => state.addTask);

  const Icon = Icons['userPlus'];
 useEffect(() => {
    if(open){
      console.log(open)
      const fetchUser = async () => {
        try{
          const {usersFormatted, total} = await findUserByNamePopoverAction(inputName,
            taskColumns.map((task) => {
              return task.uuid;
            }),
            companyRole
            ,
            userSessionContextType.userSession?.selectedCompany
           )
           setUserListPopover(usersFormatted)
           setTotal(total)
           console.log(usersFormatted) 
        }catch(error){

        }
        
      }
      fetchUser()
    }
  }, [open,inputName])

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    // Accedemos al valor del input a través de `event.currentTarget`
    event.stopPropagation()
    setInputName(event.currentTarget.value);
  };

  const insertUserOnGroup = async (value: string) => {
    const user =  userListPopover?.find((user) => (user.uuid === value));
    const task = {
      id: 1,
      uuid: user!.uuid,
      title: user!.name,
      status: '',
      waitList: inWaitList
    }
      await changeUserGroupAction(
      undefined,
      task,
      groupUuid,
      userSessionContextType.userSession?.selectedCompany
      )
      //addTask(task.title,task.uuid,task.status)
      setRefresh(Math.random())
  }

  return (
    <div className="flex items-center space-x-4 ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className=""
          >
             <Icon></Icon>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3" side="right" align="start">
          <div className="flex flex-row gap-2 items-center">
          <Checkbox checked={inWaitList} onCheckedChange={()=>{setInWaitList(!inWaitList)}} ></Checkbox>
          <p>Insertar en lista de espera</p>
          </div>
          <Command>
            <CommandInput value={inputName} onInput={handleInputChange} placeholder="Buscar usuario..." />
            <CommandList>
              {/* Si no hay resultados, mostrar CommandEmpty */}
              <CommandEmpty>Sin resultados.</CommandEmpty>

              {/* Renderizado condicional del grupo de comandos */}
              {userListPopover && userListPopover.length > 0 ? (
                <CommandGroup>
                  
                    {userListPopover.map((user) => (
                    <CommandItem
                      key={user.uuid}
                      value={user.name}
                      onSelect={(value) => {
                        insertUserOnGroup(
                          user.uuid
                        );
                        setOpen(false);
                      }}
                    >
                      <span>{user.name}</span>
                    </CommandItem>
                  ))}
                 
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
          <span className="text-sm ">{total + " Usuarios"}</span>
        </PopoverContent>
      </Popover>
    </div>
  )
}

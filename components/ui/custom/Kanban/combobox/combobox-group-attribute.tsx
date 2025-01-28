"use client"

import * as React from "react"
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
import UserSessionContext from "@/components/layout/context/user-session"
import { useEffect, useState } from "react"
import { groupAttributeListAction } from "@/actions/settings/groupAttributeListAction"
import { GroupAttribute } from "@/constants/GroupAttribute/groupAttribute"
import { createGroupGroupAttributeAction } from "@/actions/Kanban/createGroupGroupAttribute"
import { Group } from "@/constants/Group/group"

export function ComboboxGroupGroupAttibute({groupUuid, group,setRefresh}: {groupUuid: string,group: Group, setRefresh: React.Dispatch<React.SetStateAction<number>> }) {
    const [open, setOpen] = React.useState(false)
    const [inputName, setInputName] = React.useState<string>('')
    const [groupAttributeList, setGroupAttributeList] = useState<GroupAttribute[]>()
    const userSessionContextType = React.useContext(UserSessionContext)
    const addTask = useTaskStore((state) => state.addTask);

    const TagIcon = Icons['tag'];
    useEffect(() => {
        if (open) {
            const fetchUser = async () => {
                try {
                    const groupAttributeList = await groupAttributeListAction(
                        userSessionContextType.userSession?.selectedCompany!,
                        group.groupGroupAttribute ? group.groupGroupAttribute.map((value) => {
                            return value.groupAttributeUuid
                        }) : []
                    )
                    setGroupAttributeList(groupAttributeList)
                } catch (error) {

                }

            }
            fetchUser()
        }
    }, [open, inputName])

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        // Accedemos al valor del input a través de `event.currentTarget`
        event.stopPropagation()
        setInputName(event.currentTarget.value);
    };

    const insertAttributeOnGroup = async (value: string) => {
        await createGroupGroupAttributeAction(
            {
                groupUuid: groupUuid,
                groupAttributeUuid: value
            },
            userSessionContextType.userSession?.selectedCompany!
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
                        <TagIcon></TagIcon>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-3" side="right" align="start">
                    <Command>
                        {/*<CommandInput value={inputName} onInput={handleInputChange} placeholder="Buscar usuario..." />*/}
                        <CommandList   style={{ zIndex: 1000, pointerEvents: 'auto' }}>
                            {/* Si no hay resultados, mostrar CommandEmpty */}
                            <CommandEmpty>Sin resultados.</CommandEmpty>

                            {/* Renderizado condicional del grupo de comandos */}
                            {groupAttributeList && groupAttributeList.length > 0 ? (
                                <CommandGroup>

                                    {groupAttributeList.map((gA) => (
                                        <CommandItem
                                            key={gA.uuid}
                                            value={gA.title}
                                            onSelect={(value) => {
                                                insertAttributeOnGroup(
                                                    gA.uuid
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            <div className="flex flex-row items-center gap-2">
                                                <Button
                                                    className="block !opacity-100"
                                                    size='icon'
                                                    style={{
                                                        backgroundColor: gA.color,
                                                    }}
                                                    variant='outline'
                                                    disabled
                                                >
                                                    <div />
                                                </Button>
                                                <span>{gA.title}</span>
                                            </div>

                                        </CommandItem>
                                    ))}

                                </CommandGroup>
                            ) : null}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

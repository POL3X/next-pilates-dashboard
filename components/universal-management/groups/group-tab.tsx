import { useEffect, useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { categoryListAction } from '@/actions/Kanban/categoryListAction'
import { UserSessionContextType } from '@/components/layout/context/user-session'
import { Category } from '@/constants/Category/category'
import { Group } from '@/constants/Group/group'
import { groupListByFiltersAction } from '@/actions/universal-management/group/groupListByFiltersAction'
import { User } from '@/constants/User/user'
import { Separator } from '@/components/ui/separator'
import { dayEnglishToSpanish } from '@/constants/DayOfWeek'
import { Badge } from '@/components/ui/badge'
import { badgeColor } from '@/components/ui/custom/Group/badge-color'
import { changeUserGroupAction } from '@/actions/Kanban/changeUserGroupAction'
import { Task } from '@/lib/store'
import { Icons } from '@/components/icons'
import { makeActionUserGroupAction } from '@/actions/Kanban/makeActionUserGroupAction'

type FilterKeyArray = 'categorias' | 'diasSemana' | 'tagsGrupo';

interface Props {
  userSessionContextType: UserSessionContextType,
  userRowSelected: User | null
}

export interface GroupFilterUM {
  userSelected: string,
  groupName: string,
  categorias: string[],
  diasSemana: string[],
  tagsGrupo: string[],
  completo: boolean,
  listaEspera: boolean,
}

export function GroupTab({ userSessionContextType, userRowSelected }: Props) {
  const [expanded, setExpanded] = useState<number[]>([])
  const [expandedUserGroup, setExpandedUserGroup] = useState<number[]>([])
  const [filters, setFilters] = useState<GroupFilterUM>({
    userSelected: userRowSelected != null ? userRowSelected.uuid : '',
    groupName: '',
    categorias: [],
    diasSemana: [],
    tagsGrupo: [],
    completo: true,
    listaEspera: false
  })
  const [categoryList, setCategorList] = useState<Category[]>()
  const [groupList, setGroupList] = useState<Group[]>()
  const [userGroupList, setUserGroupList] = useState<Group[]>()
  const [refresh, setRefresh] = useState<number>()
  const AddUserIcon = Icons['userPlus']
  const DeleteUserIcon = Icons['trash']

  useEffect(() => {
    const fetchCategories = async () => {
      if (userSessionContextType.userSession?.selectedCompany) {
        const categoriesTmp = await categoryListAction(userSessionContextType.userSession.selectedCompany)
        setCategorList(categoriesTmp)
      }
    }
    fetchCategories()
  }, [userSessionContextType])


  const toggleExpand = (index: number) => {
    setExpanded(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const toggleExpandedUserGroup = (index: number) => {
    setExpandedUserGroup(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleFilter = (key: FilterKeyArray, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item: string) => item !== value)
        : [...prev[key], value]
    }))
  }

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  const tagsGrupo = ['TAG1', 'TAG2', 'TAG3', 'TAG4']

  useEffect(() => {
    setFilters(prev => ({ ...prev, userSelected: userRowSelected != null ? userRowSelected.uuid : '' }))
  }, [userRowSelected])

  useEffect(() => {
    const fetchGroups = async () => {
      const { groups, userGroups } = await groupListByFiltersAction(filters, userSessionContextType?.userSession?.selectedCompany)
      console.log(userGroups)
      setGroupList(groups)
      setUserGroupList(userGroups)

    }
    fetchGroups()
    console.log(groupList)
  }, [filters, userSessionContextType, refresh])

  const statusColors = {
    warning: 'bg-orange-500',
    success: 'bg-green-500',
    info: 'bg-blue-500',
  }

  const renderDropdown = (title: string, filterKey: FilterKeyArray, uuid?: string[], options?: string[]) => {
    const uuidEmpty = (uuid?.length == 0 || uuid == undefined || uuid[0] == "") ? true : false

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between w-full">
            {filters[filterKey].length > 0
              ? `${filters[filterKey].length} seleccionado(s)`
              : title}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          {options?.map((option, index) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={(uuidEmpty == true || uuid == undefined) ? `${filterKey}-${option}` : `${uuid[index]}`}
                checked={filters[filterKey].includes((uuidEmpty == true || uuid == undefined) ? option : uuid[index])}
                onCheckedChange={() => toggleFilter(filterKey, (uuidEmpty == true || uuid == undefined) ? option : uuid[index])}
              />
              <label
                htmlFor={(uuidEmpty == true || uuid == undefined) ? `${filterKey}-${option}` : `${uuid[index]}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    )
  }
  const onClickAddUserGroup = async (userUuid?: string, groupUuid?: string) => {
    if(userUuid && groupUuid){
      await changeUserGroupAction(
        undefined,
        {
          id: Math.random(),
          uuid: userUuid,
          title: '',
          status: '',
          waitList: false
        } as Task,
        groupUuid,
        userSessionContextType.userSession?.selectedCompany
      )
      setRefresh(Math.random())
    }
  }

  const onClickDeleteUserGroup = async (userUuid?: string, groupUuid?: string) => {
    if(userUuid && groupUuid){
      await makeActionUserGroupAction({
        id: Math.random(),
        uuid: userUuid,
        title: '',
        status: groupUuid,
        waitList: false
      } as Task, 'DELETE',  userSessionContextType.userSession?.selectedCompany)
      setRefresh(Math.random())
    }
  }


  return (
    <div className='flex flex-row gap-2'>
      <div className="w-[50%]">
        <h2 className="text-2xl font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Nombre Grupo..."
            value={filters.groupName}
            onChange={(e) => handleFilterChange('groupName', e.target.value)} />
          {renderDropdown("Categoría",
            "categorias",
            categoryList?.map((category) => {
              return category.uuid
            }), categoryList?.map((category) => {
              return category.name
            }))}
          {renderDropdown("Días de la Semana", "diasSemana", [], diasSemana)}
          {renderDropdown("Tag de Grupo", "tagsGrupo", [], tagsGrupo)}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completo"
              checked={filters.completo}
              onCheckedChange={(checked) => handleFilterChange('completo', checked)} />
            <label htmlFor="completo">Mostrar completos</label>
          </div>
          <div className="flex items-center space-x-2">
            <span>Lista de Espera</span>
            <Switch
              checked={filters.listaEspera}
              onCheckedChange={(checked) => handleFilterChange('listaEspera', checked)} />
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          {groupList && groupList.map((group, index) => (
            <Card key={group.uuid} className="overflow-hidden">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 rounded-none"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{dayEnglishToSpanish[group.dayOfWeek.toLocaleLowerCase()]}</span>
                    <span>{group.name}</span>
                    <span>{group.startTime.toString()}</span>
                    <span className="text-sm text-gray-500">Monitor</span>
                  </div>
                  <div className='flex flex-row'>
                    {filters.listaEspera ?
                    <Badge variant={"outline"} className="border-blue-500 text-blue-500"  >{group.userGroup.length}</Badge>
                  : <Badge variant={"outline"} className={badgeColor(group.userGroup.length, group.maxUsers)}>{group.userGroup.length + "/" + group.maxUsers}</Badge>}
                    {expanded.includes(index) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                </Button>
                {expanded.includes(index) && (
                  <div className="p-4 bg-gray-100 flex items-center justify-between">
                    <div className="flex space-x-2">
                      {/*<span className="bg-white px-2 py-1 rounded text-sm">{group.tagsGrupo.join(', ')}</span>
                    <span className="bg-white px-2 py-1 rounded text-sm">{group.categorias.join(', ')}</span>
                    <span className="bg-white px-2 py-1 rounded text-sm">{group.diasSemana.join(', ')}</span>*/}
                      <Button variant="outline"
                        size="sm"
                        className="" onClick={()=>{onClickAddUserGroup(userRowSelected?.uuid,group.uuid)}}><AddUserIcon></AddUserIcon></Button>

                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <ScrollBar orientation="vertical"></ScrollBar>
        </ScrollArea>
      </div>
      <Separator orientation="vertical" />
      <div className='w-[50%]'>
        <ScrollArea className="">
          {userGroupList && userGroupList.map((group, index) => (
            <Card key={group.uuid} className="overflow-hidden">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 rounded-none"
                  onClick={() => toggleExpandedUserGroup(index)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{dayEnglishToSpanish[group.dayOfWeek.toLocaleLowerCase()]}</span>
                    <span>{group.name}</span>
                    <span>{group.startTime.toString()}</span>
                    <span className="text-sm text-gray-500">Monitor</span>
                  </div>
                  {expandedUserGroup.includes(index) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </Button>
                {expandedUserGroup.includes(index) && (
                  <div className="p-4 bg-gray-100 flex items-center justify-between">
                    <div className="flex space-x-2">
                      {/*<span className="bg-white px-2 py-1 rounded text-sm">{group.tagsGrupo.join(', ')}</span>
                    <span className="bg-white px-2 py-1 rounded text-sm">{group.categorias.join(', ')}</span>
                    <span className="bg-white px-2 py-1 rounded text-sm">{group.diasSemana.join(', ')}</span>*/}
                      <Button variant="outline"
                        size="sm"
                        className="" onClick={()=>{onClickDeleteUserGroup(userRowSelected?.uuid,group.uuid)}}><DeleteUserIcon></DeleteUserIcon></Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <ScrollBar orientation="vertical"></ScrollBar>
        </ScrollArea>
      </div></div>
  )
}
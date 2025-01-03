import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, CheckIcon } from 'lucide-react'
import { User } from '@/constants/User/user'
import { ScrollArea, ScrollBar } from '../../ui/scroll-area'
import { UserAttributeList } from './user-attribute-list'
import { ScrollAreaKanban } from '@/components/ui/scroll-area-kanban'
import { UserInfo } from '@/constants/User/UserInfo'

interface Props {
  isEditing: boolean,
  user: User | null,
  setRefresh: Dispatch<SetStateAction<number>>
  userInfo: UserInfo,
  setUserInfo: Dispatch<SetStateAction<UserInfo>>
}

export default function UserCard({ isEditing, user, setRefresh, userInfo,setUserInfo }: Props) {


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  return (

    <>{isEditing ? (
      <div className="flex flex-row gap-4">
        <div className='flex flex-col'>
          <div>
            <label className="text-sm font-medium text-gray-500">Nombre</label>
            <Input name="shortName" value={userInfo.shortName} onChange={handleChange} className="" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <Input name="email" value={userInfo.email} onChange={handleChange} className="" />
          </div>
        </div>
        <div className='flex flex-col'> 
        <div>
            <label className="text-sm font-medium text-gray-500">Apellidos</label>
            <Input name="shortSurname" value={userInfo.shortSurname} onChange={handleChange} className="" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Teléfono</label>
            <Input name="phone" value={userInfo.phone} onChange={handleChange} className="" />
          </div>
         
        </div>
        <div className="">
            {user?.status === 'ENABLE' ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ACTIVO
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                DESHABILITADO
              </Badge>
            )}
          </div>
      </div>
    ) : (
      <div className="flex flex-row items-center gap-4">
        <div className='flex flex-row w-[40%] justify-between'>
          <div className='flex flex-col'>
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre</label>
              <p className=" font-semibold">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="">{user?.email}</p>
            </div>
          </div>
          <div className='flex flex-col items-start gap-4'>
            <div>
              <label className="text-sm font-medium text-gray-500">Teléfono</label>
              <p className="">{user?.phoneNumber} -</p>
            </div>
            <div className="">
              {user?.status === 'ENABLE' ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ACTIVO
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  DESHABILITADO
                </Badge>
              )}
            </div>
          </div>
        </div>
        <ScrollAreaKanban className='w-[60%] h-[100px]'>
          <UserAttributeList userUserAttributeList={user?.userUserAttribute} user={user} setRefresh={setRefresh}></UserAttributeList>
        </ScrollAreaKanban>

      </div>
    )}</>
  )
}
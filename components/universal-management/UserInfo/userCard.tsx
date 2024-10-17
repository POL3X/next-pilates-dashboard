import React, { Dispatch, SetStateAction, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, CheckIcon } from 'lucide-react'
import { User } from '@/constants/User/user'
import { ScrollArea, ScrollBar } from '../../ui/scroll-area'
import { UserAttributeList } from './user-attribute-list'

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

interface Props {
  isEditing: boolean,
  user: User | null,
  setRefresh: Dispatch<SetStateAction<number>>
}

export default function UserCard({ isEditing, user, setRefresh}: Props) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  return (

    <>{isEditing ? (
      <div className="flex flex-row gap-4">
        <div className='flex flex-col'>
          <div>
            <label className="text-sm font-medium text-gray-500">Nombre</label>
            <Input name="name" value={userInfo.name} onChange={handleChange} className="" />

          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <Input name="email" value={userInfo.email} onChange={handleChange} className="" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Teléfono</label>
          <Input name="phone" value={userInfo.phone} onChange={handleChange} className="" />
        </div>
        <div className="">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ACTIVO
          </Badge>
        </div>
      </div>
    ) : (
      <div className="flex flex-row items-center gap-4">
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
            {user?.status == 'ENABLE' ? <Badge variant="secondary" className="bg-green-100 text-green-800">
              ACTIVO
            </Badge> :
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                DESACTIVADA
              </Badge>}
          </div>
        </div>
        <ScrollArea className=' w-[350px] h-[100px]'>
            <UserAttributeList userUserAttributeList={user?.userUserAttribute} user={user} setRefresh={setRefresh}></UserAttributeList>
            <ScrollBar orientation='vertical'></ScrollBar>
        </ScrollArea>

      </div>
    )}</>
  )
}
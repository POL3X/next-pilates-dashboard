import React, { Dispatch, SetStateAction } from 'react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User } from '@/constants/User/user'
import { UserAttributeList } from './user-attribute-list'
import { UserInfo } from '@/constants/User/UserInfo'
import './userCard.css' // Import the custom CSS file

interface Props {
  isEditing: boolean,
  user: User | null,
  setRefresh: Dispatch<SetStateAction<number>>
  userInfo: UserInfo,
  setUserInfo: Dispatch<SetStateAction<UserInfo>>
}

export default function UserCard({ isEditing, user, setRefresh, userInfo, setUserInfo }: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  const handleStatusToggle = () => {
    setUserInfo({ ...userInfo, status: userInfo.status === 'ENABLE' ? 'DISABLE' : 'ENABLE' });
  }

  return (

    <>{isEditing ? (
      <div className="flex flex-row  gap-4">
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
        <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-gray-500">Click para cambiar</label>
          <Badge 
            variant="secondary" 
            className={`no-select justify-center ${userInfo.status === 'ENABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            onClick={handleStatusToggle}
          >
            {userInfo.status === 'ENABLE' ? 'ACTIVO' : 'DESHABILITADO'}
          </Badge>
        </div>
      </div>
    ) : (
      <div className="flex flex-row  min-[1270px]:items-center max-[1270px]:flex-col  gap-4">
        <div className='flex flex-row min-[1270px]:w-[50%] justify-between pr-2'>
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
          <div className='flex flex-col items-start '>
            <div>
              <label className="text-sm font-medium text-gray-500">Teléfono</label>
              <p className="">{user?.phoneNumber} -</p>
            </div>
            <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-500">Estado</label>
              {user?.status === 'ENABLE' ? (
                <Badge variant="secondary" className=" bg-green-100 text-green-800">
                  ACTIVO
                </Badge>
              ) : (
                <Badge variant="secondary" className=" bg-red-100 text-red-800">
                  DESHABILITADO
                </Badge>
              )}
            </div>
          </div>
        </div>
          <div className='min-[1270px]:w-[50%] h-[100px] overflow-y-auto custom-scrollbar'>
            <UserAttributeList userUserAttributeList={user?.userUserAttribute} user={user} setRefresh={setRefresh}></UserAttributeList>
        </div > 
      
      </div>
    )}</>
  )
}
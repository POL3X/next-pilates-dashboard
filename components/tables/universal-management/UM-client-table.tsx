'use client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { DataTableUniversalManagement } from '@/components/ui/custom/universal-management/data-table-universal-management';
import { User } from '@/constants/User/user';
import { PaginationState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { userListUMAction } from '@/actions/universal-management/userListUMAction';
import UserSessionContext from '@/components/layout/context/user-session';

interface ProductsClientProps {
  setUserRowSelected: Dispatch<SetStateAction<User | null>>
}

export const UniversalManagementClientTable: React.FC<ProductsClientProps> = ({ setUserRowSelected}: ProductsClientProps) => {
  const router = useRouter();
  const userSessionContextType = useContext(UserSessionContext);
  const [users, setUsers] = useState<User[]>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [pageCount, setPageCount] = useState<number>(1)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [nameFilter, setNameFilter] = useState<string>('')

  useEffect(() =>{
    const fetchUsers = async () =>{
      const selectedCompany = userSessionContextType.userSession?.selectedCompany ? userSessionContextType.userSession?.selectedCompany : ''
      const {usersFormatted, total} = await userListUMAction(nameFilter,selectedCompany,pageIndex,pageSize)
      setUsers(usersFormatted)
      setTotalUsers(total)
      setPageCount(Math.ceil(totalUsers / pageSize))
    }
    fetchUsers()
  },[pageIndex, nameFilter, userSessionContextType.userSession])

  

  return (
    <>
      <div className="flex items-start justify-between mb-2">
        <Heading
          title={`Usuarios (${totalUsers})`}
          description=""
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/user/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTableUniversalManagement searchKey="name" 
        columns={columns} 
        data={users} 
        totalUsers={totalUsers} 
        pageCount={pageCount} 
        pageIndex={pageIndex} 
        pageSize={pageSize} 
        setPagination={setPagination} 
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        setUserRowSelected={setUserRowSelected}/>
    </>
  );
};

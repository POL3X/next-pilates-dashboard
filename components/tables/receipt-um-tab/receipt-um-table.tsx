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
import { DataTableReceiptUM } from '@/components/ui/custom/universal-management/data-table-receipt-um';
import { CardTitle } from '@/components/ui/card';
import { NewReceiptTabButton } from './new-receipt-button';
import { Receipt } from '@/constants/Receipt/Receipt';
import { receipListByRecipientAction } from '@/actions/universal-management/receipt/receipListByRecipientAction';
import { ReceiptUmFilter } from '@/components/universal-management/receipt/receipt-tab';

interface ProductsClientProps {
  //setUserRowSelected: Dispatch<SetStateAction<User | null>>
  title: string,
  addNewButton: boolean,
  user: User | null,
  receiptUmFilter?: ReceiptUmFilter
}

export const ReceiptUMTable: React.FC<ProductsClientProps> = ({title, addNewButton, user,receiptUmFilter}: ProductsClientProps) => {
  const router = useRouter();
  const userSessionContextType = useContext(UserSessionContext);
  const [receipt, setReceipts] = useState<Receipt[]>([])
  const [refresh, setRefresh] = useState<number>(0)

  useEffect(() =>{
    const fetchUsers = async () =>{
      const selectedCompany = userSessionContextType.userSession?.selectedCompany ? userSessionContextType.userSession?.selectedCompany : '';
      const receipt = await receipListByRecipientAction(user?.uuid,selectedCompany,receiptUmFilter?.dateRange,receiptUmFilter?.pending,receiptUmFilter?.complete)  
      setReceipts(receipt)

    }
    fetchUsers()
  },[userSessionContextType.userSession, receiptUmFilter,user, refresh])

  

  return (
    <>
      <div className="flex items-center justify-between mb-2 mt-2">
        <CardTitle
          title={``}
        >{title}</CardTitle>
        { addNewButton ?
        <NewReceiptTabButton user={user} setRefresh={setRefresh}></NewReceiptTabButton> : <></>}
      </div>
      <DataTableReceiptUM 
        columns={columns} 
        data={receipt} 
        /*setUserRowSelected={setUserRowSelected}*//>
    </>
  );
};

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
import { set } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface ProductsClientProps {
  //setUserRowSelected: Dispatch<SetStateAction<User | null>>
  title: string,
  addNewButton: boolean,
  user: User | null,
  receiptUmFilter?: ReceiptUmFilter,
  setReceiptSelected: Dispatch<SetStateAction<Receipt | undefined>>
  refresh: number,
  setRefresh: Dispatch<SetStateAction<number>>,
  setExternalReceipt: Dispatch<SetStateAction<Receipt[] | undefined>>
  setPendingCount: Dispatch<SetStateAction<number>>
  setCompleteCount: Dispatch<SetStateAction<number>>
}

export const ReceiptUMTable: React.FC<ProductsClientProps> = ({ title, addNewButton, user, receiptUmFilter, setReceiptSelected, refresh, setRefresh, setExternalReceipt,setCompleteCount,setPendingCount }: ProductsClientProps) => {
  const router = useRouter();
  const userSessionContextType = useContext(UserSessionContext);
  const [receipt, setReceipts] = useState<Receipt[]>([])
  const [prevUser, setPrevUser] = useState<User | null>(null);

  const handleDelete = () => {
    setRefresh(Math.random());
  };

  useEffect(() => {
    const fetchReceipts = async () => {
      const selectedCompany = userSessionContextType.userSession?.selectedCompany ? userSessionContextType.userSession?.selectedCompany : '';
      const { receiptList, receiptCountCharged, receiptCountPending, error } = await receipListByRecipientAction(user?.uuid, selectedCompany, receiptUmFilter?.dateRange, receiptUmFilter?.pending, receiptUmFilter?.complete);
      setReceipts(receiptList);
      setExternalReceipt(receiptList);

      if (!error || (user?.uuid !== prevUser?.uuid)) {
        setPendingCount(receiptCountPending);
        setCompleteCount(receiptCountCharged);
        setPrevUser(user);
      }
    };
    fetchReceipts();
  }, [userSessionContextType.userSession, receiptUmFilter, user, refresh]);

  return (
    <>
      <div className="flex items-center justify-between mb-2 mt-2">
        <CardTitle
          title={``}
        >{title}</CardTitle>
        {addNewButton ?
          <NewReceiptTabButton user={user} setRefresh={setRefresh}></NewReceiptTabButton> : <></>}
      </div>
      <DataTableReceiptUM
        columns={columns(handleDelete)}
        data={receipt}
        setReceiptSelected={setReceiptSelected}
        onDelete={handleDelete} // Pass the callback to update the receipt list
        onDeselect={()=>{}}   
      />
    </>
  );
};

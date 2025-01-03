'use client'
import { userAttributeListAction } from "@/actions/settings/userAttributeListAction"
import { UserAttribute } from "@/constants/UserAttribute/userAttribute"
import { useState, useContext, useEffect } from "react"
import UserSessionContext from "../layout/context/user-session"
import { NewAttributeUserDialog } from "./dialog/new-user-attribute-dialog"
import { UserAttributeItem } from "./UserAttributeList/user-attribute-list-item"
import { ReceiptTypeItem } from "./dialog/ReceiptTypeList/receipt-type-list-item"
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType"
import { receiptTypeListUmAction } from "@/actions/universal-management/receipt-type/receipt-type-list"
import { NewReceiptTypeDialog } from "./dialog/new-receipt-type-dialog"

export function ReceiptTypeTab(){
    
    const [refresh, setRefresh] = useState<number>(0)
    const [receiptTypeList, setReceiptTypeList] = useState<ReceiptType[]>([])
    const userSessionContext = useContext(UserSessionContext)

    useEffect(() => {
        const fetchGroupAttributes= async () => {
            const receiptTypeList = await receiptTypeListUmAction(userSessionContext.userSession?.selectedCompany!)
            setReceiptTypeList(receiptTypeList)
        }
        fetchGroupAttributes()
    },[userSessionContext, refresh])
    
    return (
    <>
        <NewReceiptTypeDialog user={null} setRefresh={setRefresh}></NewReceiptTypeDialog>
        {receiptTypeList.map((receiptType, index) => {
            return (<ReceiptTypeItem key={index + receiptType.uuid} receiptType={receiptType} companyUuid={userSessionContext.userSession?.selectedCompany!} setRefresh={setRefresh}></ReceiptTypeItem>)
        })}
    </>)
}

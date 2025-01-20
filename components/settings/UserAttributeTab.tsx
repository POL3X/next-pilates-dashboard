'use client'

import { useContext, useEffect, useState } from "react";
import UserSessionContext from "../layout/context/user-session";
import { UserAttribute } from "@/constants/UserAttribute/userAttribute";
import { userAttributeListAction } from "@/actions/settings/userAttributeListAction";
import { UserAttributeItem } from "./UserAttributeList/user-attribute-list-item";
import { NewAttributeUserDialog } from "./dialog/new-user-attribute-dialog";

export function UserAttributeTab(){
    
    const [refresh, setRefresh] = useState<number>(0)
    const [attributeList, setAttributeList] = useState<UserAttribute[]>([])
    const userSessionContext = useContext(UserSessionContext)

    useEffect(() => {
        const fetchGroupAttributes= async () => {
            const attributeList = await userAttributeListAction(userSessionContext.userSession?.selectedCompany!,[])
            setAttributeList(attributeList)
        }
        fetchGroupAttributes()
    },[userSessionContext, refresh])
    
    return (
    <>
        <NewAttributeUserDialog user={null} setRefresh={setRefresh}></NewAttributeUserDialog>
        {attributeList.map((attribute, index) => {
            return (<UserAttributeItem key={index + attribute.uuid} userAttribute={attribute} companyUuid={userSessionContext.userSession?.selectedCompany!} setRefresh={setRefresh}></UserAttributeItem>)
        })}
    </>)
}
'use client'

import { SetStateAction, useContext, useEffect, useState } from "react";
import { NewAttributeGroupDialog } from "./dialog/new-attribute-group-dialog";
import { GroupAttribute } from "@/constants/GroupAttribute/groupAttribute";
import UserSessionContext from "../layout/context/user-session";
import { groupAttributeListAction } from "@/actions/settings/groupAttributeListAction";
import { GroupAttributeItem } from "./GroupAttributeList/group-attribute-item";

export function GroupAttributeTab(){
    
    const [refresh, setRefresh] = useState<number>(0)
    const [groupAttributeList, setGroupAttributeList] = useState<GroupAttribute[]>([])
    const userSessionContext = useContext(UserSessionContext)

    useEffect(() => {
        const fetchGroupAttributes= async () => {
            const groupAttribute = await groupAttributeListAction(userSessionContext.userSession?.selectedCompany!,[])
            setGroupAttributeList(groupAttribute)
        }
        fetchGroupAttributes()
    },[userSessionContext, refresh])
    
    return (
    <>
        <NewAttributeGroupDialog user={null} setRefresh={setRefresh}></NewAttributeGroupDialog>
        {groupAttributeList.map((groupAttribute) => {
            return (<GroupAttributeItem groupAttribute={groupAttribute} companyUuid={userSessionContext.userSession?.selectedCompany!} setRefresh={setRefresh}></GroupAttributeItem>)
        })}
    </>)
}
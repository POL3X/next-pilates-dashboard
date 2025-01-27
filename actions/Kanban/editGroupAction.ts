'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { Group } from "@/constants/Group/group";
import { Receipt } from "@/constants/Receipt/Receipt";

export async  function editGroupAction(group: Group,compnayUuid: string){

    try{
        const token = await getCookie();
        console.log(group.startTime)
        const extractTime = (date: Date): string => {
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');
            console.log(hours);
            return `${hours}:${minutes}:${seconds}`;
          };
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/group/";
        const messageResponse = await fetch( url, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
                uuid: group.uuid,
                companyUuid: compnayUuid,
                name: group.name, 
                dayOfWeek: group.dayOfWeek, 
                startTime: extractTime(group.startTime), 
                duration:  extractTime(group.duration), 
                maxUsers: group.maxUsers, 
                categoryUuid: group.categoryUuid, 
            }
        )})
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }

          const receiptR: Receipt= await messageResponse.json();
          return receiptR;
        
    }catch(error){ 
        console.log(error);
    }
}
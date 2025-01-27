'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { Group } from "@/constants/Group/group";
import { Receipt } from "@/constants/Receipt/Receipt";

export async  function editGroupAction(group: Group,compnayUuid: string){

    try{
        const token = await getCookie();
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
                startTime: group.startTime.toLocaleTimeString('es-ES', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }), 
                duration: group.duration.toLocaleTimeString('es-ES', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }), 
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
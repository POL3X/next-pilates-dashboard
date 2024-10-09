'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { GroupGroupAttribute } from "@/constants/GroupGroupAttribute/GroupGroupAttribute";

export async  function createGroupGroupAttributeAction(groupGroupAttribute: GroupGroupAttribute, companyUuid: string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/group-group-attribute";
        const messageResponse = await fetch( url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
                companyUuid: companyUuid,  // Asigna el UUID de la empresa seleccionada
                groupUuid: groupGroupAttribute.groupUuid,
                groupAttributeUuid: groupGroupAttribute.groupAttributeUuid
            }) 
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }

          const groupR: GroupGroupAttribute = await messageResponse.json();
          return groupR;
        
    }catch(error){ 
        throw(error)
    }
}
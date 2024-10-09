'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { GroupAttribute } from "@/constants/GroupAttribute/groupAttribute";

export async  function createGroupAttributeAction(groupAttribute: GroupAttribute){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/group-attribute";
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
                companyUuid: groupAttribute.companyUuid,  // Asigna el UUID de la empresa seleccionada
                title: groupAttribute.title,
                color: groupAttribute.color,
                description: groupAttribute.description
            }) 
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }
          const groupAttributeR: GroupAttribute = await messageResponse.json();
          return groupAttributeR;
        
    }catch(error){ 
        throw(error)
    }
}
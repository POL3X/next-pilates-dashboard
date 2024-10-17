'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";

export async  function deleteGroupAttributeAction(groupAttributeUuid: string, companyUuid: string){

    try{
        const token = await getCookie();
        console.log(groupAttributeUuid)
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/group-attribute?companyUuid=" + companyUuid + "&groupAttributeUuid="+groupAttributeUuid;

        const messageResponse = await fetch( url, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin',
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }
        
    }catch(error){ 
        throw(error)
    }
}
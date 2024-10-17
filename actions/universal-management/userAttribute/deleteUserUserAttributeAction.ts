'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";

export async  function deleteUserUserAttributeAction(userUuid: string, userAttributeUuid:string, companyUuid?: string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/user-user-attribute?companyUuid=" + companyUuid + "&userUuid="+userUuid+ "&userAttributeUuid="+userAttributeUuid;
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
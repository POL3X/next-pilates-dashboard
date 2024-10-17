'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";

export async function editUserUserAttributeAction(userUuid:string, userAttributeUuid:string, value: string,selectedCompany?: string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/user-user-attribute";
        const messageResponse = await fetch( url, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
                userUuid: userUuid,
                userAttributeUuid: userAttributeUuid,
                value: value,
                companyUuid: selectedCompany
            }) 
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }
        
    }catch(error){ 
        throw(error)
    }
}
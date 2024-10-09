'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { Task } from "@/lib/store";

export async function makeActionUserGroupAction(user :Task, action: string, selectedCompany?: string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/group/action-user-group";
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
                userUuid: user.uuid,
                groupUuid: user.status,
                action: action,
                companyUuid: selectedCompany,
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
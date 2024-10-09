'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { Task } from "@/lib/store";

export async function changeUserGroupAction(oldGroup: string | undefined, user :Task, newGroup: string,selectedCompany?: string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/group/user-group";
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
                oldGroupUuid: oldGroup,
                userUuid: user.uuid,
                newGroupUuid: newGroup,
                companyUuid: selectedCompany,
                waitList: user.waitList,
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
'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { Receipt } from "@/constants/Receipt/Receipt";
import { UserUserAttribute } from "@/constants/UserUserAttribute/userUserAttribute";

export async  function createUserUserAttributeAction(userUserAttribute: UserUserAttribute, companyUuid?:string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/user-user-attribute/";
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
                userUuid: userUserAttribute.userUuid,
                userAttributeUuid: userUserAttribute.userAttributeUuid,
                value: userUserAttribute.value,
                companyUuid: companyUuid
            }) 
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }

          const userUserAttributeR: UserUserAttribute= await messageResponse.json();
          return userUserAttributeR;
        
    }catch(error){ 
        throw(error)
    }
}
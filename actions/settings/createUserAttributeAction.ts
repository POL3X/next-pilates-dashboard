'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { UserAttribute } from "@/constants/UserAttribute/userAttribute";

export async  function createUserAttributeAction(userAttribute: UserAttribute){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/user-attribute";
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
                companyUuid: userAttribute.companyUuid,  // Asigna el UUID de la empresa seleccionada
                name: userAttribute.name,
                question: userAttribute.question,
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
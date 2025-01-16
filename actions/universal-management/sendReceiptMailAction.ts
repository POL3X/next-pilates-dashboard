'use server'

import { getCookie } from "../cookies/cookiesAction";


export async  function sendReceiptMailAction(receiptUuid: string ,companyUuid?: string){
    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/universal-management/mail/receipt";
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
                uuid: receiptUuid,
                companyUuid: companyUuid
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
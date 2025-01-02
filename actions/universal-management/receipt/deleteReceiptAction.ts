'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";

export async function deleteReceiptAction(receiptUuid: string, companyUuid: string){

    try{

        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/universal-management/receipt/";
        console.log(url)
        const messageResponse = await fetch(url, {
            method: "DELETE",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
            receiptUuid: receiptUuid,
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
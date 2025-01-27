'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { Receipt } from "@/constants/Receipt/Receipt";

export async  function editReceiptAction(receipt: Receipt,compnayUuid: string){

    try{
        receipt.companyUuid = compnayUuid;
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/universal-management/receipt/";
        const messageResponse = await fetch( url, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify(receipt) 
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }

          const receiptR: Receipt= await messageResponse.json();
          return receiptR;
        
    }catch(error){ 
        throw(error)
    }
}
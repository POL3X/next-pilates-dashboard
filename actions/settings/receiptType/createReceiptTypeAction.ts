'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { ReceiptTypeFrom } from "@/components/settings/dialog/new-receipt-type-dialog";
import { GroupAttribute } from "@/constants/GroupAttribute/groupAttribute";
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType";

export async  function createReceiptTypeAction(receiptTypeForm: ReceiptTypeFrom, companyUuid: string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/settings/receipt-type";
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
                companyUuid: companyUuid, 
                name: receiptTypeForm.name,
                concept: receiptTypeForm.concept,
                price: receiptTypeForm.price
            }) 
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }
          const receipt: ReceiptType = await messageResponse.json();
          return receipt;
        
    }catch(error){ 
        throw(error)
    }
}
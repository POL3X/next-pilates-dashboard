'use server'
import { DateRange } from "react-day-picker";

import { User } from "@/constants/User/user";
import { getCookie } from "@/actions/cookies/cookiesAction";
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType";
import { Category } from "@/constants/Category/category";

export async  function categoryListAction(companyUuid: string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/group/category?companyUuid="+companyUuid;

        const messageResponse = await fetch( url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin'
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }

          const categories: Category[]= await messageResponse.json();
          return categories;
        
    }catch(error){ 
        throw(error)
    }
}
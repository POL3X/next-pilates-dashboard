'use server'

import { getCookie } from "../cookies/cookiesAction";
import { ReceiptType } from "@/constants/ReceiptType/ReceiptType";
import { CompanyRole } from "@/constants/CompanyRole/CompanyRole";
import { UserUserAttribute } from "@/constants/UserUserAttribute/userUserAttribute";
import { User } from "@/constants/User/user";

interface FormData{
    name: string,
    surname: string,
    email: string,
    phoneNumber: string
}

export async  function createUserAction(userFormData: FormData, userCompanyRolSelected: CompanyRole, receiptTypSelected: ReceiptType | null, userAttribute: UserUserAttribute[], companyUuid?: string){
    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/universal-management/user/";
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
                userFormData: userFormData,
                companyRol: userCompanyRolSelected,
                receiptType: receiptTypSelected,
                userUserAttribute: userAttribute,
                companyUuid: companyUuid
            }) 
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }

          const user: User = await messageResponse.json();
          return user;
        
    }catch(error){ 
        throw(error)
    }
}
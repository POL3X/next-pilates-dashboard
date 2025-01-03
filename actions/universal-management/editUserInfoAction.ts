'use server'

import { getCookie } from "../cookies/cookiesAction";
import { UserInfo } from "@/constants/User/UserInfo";


export async  function editUserInfoAction(userUuid:string,userInfo: UserInfo ,companyUuid?: string){
    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/universal-management/user/";
        console.log(url)
        const messageResponse = await fetch( url, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
                uuid: userUuid,
                userInfo: userInfo,
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
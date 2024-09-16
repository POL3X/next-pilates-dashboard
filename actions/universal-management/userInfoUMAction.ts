'use server'
import { getCookie, setCookie } from "../cookies/cookiesAction";
import { User } from "@/constants/User/user";

export async  function userInfoUMAction(userUuid:string, companyUuid: string){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/universal-management/user?userUuid="+userUuid+"&companyUuid="+companyUuid;

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

          const user: User= await messageResponse.json();
          return user;
        
    }catch(error){ 
        throw(error)
    }
}
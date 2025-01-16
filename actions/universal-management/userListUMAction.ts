'use server'
import { getCookie, setCookie } from "../cookies/cookiesAction";
import { User } from "@/constants/User/user";

export async  function userListUMAction(name:string, companyUuid: string, pageIndex:number, pageSize:number){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/universal-management/users?name="+name+"&companyUuid="+companyUuid+"&pageIndex="+pageIndex+"&pageSize="+pageSize;

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
            return {usersFormatted: [], total:0};
          }

          const {usersFormatted, total}: {usersFormatted:User[], total:number} = await messageResponse.json();
          return {usersFormatted, total};
        
    }catch(error){ 
        throw(error)
    }
}
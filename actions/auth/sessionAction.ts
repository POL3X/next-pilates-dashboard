'use server'
import { LoginBodyPost } from "@/types/body-posts";
import { getCookie, setCookie } from "../cookies/cookiesAction";
import { UserSession } from "@/types/auth";

export async  function sessionAction(){

    try{
        const token = await getCookie();

        const messageResponse = await fetch( process.env.NEXT_PUBLIC_BACK_URL + "/v1/auth/session", {
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

          const userSession: UserSession  = await messageResponse.json();
          return userSession;
        
    }catch(error){ 
        throw(error)
    }
}
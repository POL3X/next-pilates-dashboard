'use server'
import { LoginBodyPost } from "@/types/body-posts";
import { setCookie } from "../cookies/cookiesAction";

export async  function loginAction(email: string, password: string){

    const loginBody: LoginBodyPost= {
        email: email,  
        password: password
      };
    const formBody = JSON.stringify(loginBody)
    try{
        const messageResponse = await fetch( process.env.NEXT_PUBLIC_BACK_URL + "/v1/auth/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                          },
            body: formBody,
            cache: 'no-store',
            credentials: 'same-origin'
          })
          
          if(200 != messageResponse.status){
            const {error} = await messageResponse.json();
            return {
              success: false,
              message: error
            }
          }
          const {access_token, expirationDate} = await messageResponse.json();
          setCookie(access_token, expirationDate)
          return {
            success: true,
            message: 'Logged in successfully 😊 👌'
          };
        
    }catch(error){  
        throw(error)
    }
}
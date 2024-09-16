'use server'

import { cookies } from "next/headers";

export async function setCookie(token: string, expirationDate: string){
    cookies().set('token', token,{
        path: '/',
        expires: new Date(expirationDate),
        secure: true,
        httpOnly: true,
      })  
}


export async function setCookieDefaultCompany(companyUuid: string){
    cookies().set('defaultCompany', companyUuid,{
        path: '/',
        secure: true,
        httpOnly: true,
      })  
}

export async function getDefaultCompanyCookie(){
    return cookies().get('defaultCompany');  
}

export async function getCookie(){
    return cookies().get('token');  
}

export async function removeToken(){
    cookies().delete('token');
}

export async function existTokenCookie(): Promise<boolean>{

    const requestCookie = cookies().get('token');
    if(undefined == requestCookie){
        return false;
    }
    return true;
}
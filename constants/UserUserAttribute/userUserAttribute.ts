import { UserAttribute } from "../UserAttribute/userAttribute";

export interface UserUserAttribute{
    userUuid: string,
    userAttributeUuid:string,
    value: string,
    userAttribute:UserAttribute
}
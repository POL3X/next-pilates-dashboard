import { City } from "../City/City";
import { UserCompany } from "../UserCompany/UserCompany";
import { UserUserAttribute } from "../UserUserAttribute/userUserAttribute";

export type User = {
    uuid: string;
    name: string;
    email: string;
    passwordHash?: string;
    role: 'ADMIN' | 'USER';
    status: 'ENABLE' | 'DISABLE';
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    cityId?: number;
    city?: City;
    userCompany?: UserCompany[];
    phoneNumber?: string;
    userUserAttribute?: UserUserAttribute[]
}
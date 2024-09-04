import { City } from "../City/City";
import { UserCompany } from "../UserCompany/UserCompany";

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
}
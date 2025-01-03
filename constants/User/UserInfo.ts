export interface UserInfo {
    name: string;
    shortName?: string;
    shortSurname?: string;
    email: string;
    phone: string;
    status: 'ENABLE' | 'DISABLE';
}


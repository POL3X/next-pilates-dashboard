export interface UserSession{
    uuid: string,
    role: string,
    name: string,
    company:CompanySession[],
    selectedCompany?: string
}

export interface CompanySession{
    uuid: string,
    name: string,
    role: string
}
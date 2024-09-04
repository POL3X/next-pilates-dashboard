import { Company } from "../Company/Company";
import { CompanyRole } from "../CompanyRole/CompanyRole";
import { ReceiptType } from "../ReceiptType/ReceiptType";

export type UserCompany = {
    createdAt?: Date;
    updatedAt?: Date;
    company?: Company;
    companyRole?: CompanyRole;
    receiptType?: ReceiptType;
}
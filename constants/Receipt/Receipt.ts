import { Company } from "../Company/Company";
import { ReceiptType } from "../ReceiptType/ReceiptType";
import { User } from "../User/user";

export type Receipt = {
    uuid: string;
    companyUuid: string;
    recipientUuid: string;
    executorUuid?: string;
    concept?: string;
    amount?: number;
    status: 'PENDING' | 'CHARGED';
    chargedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    receiptTypeUuid?: string;

    receiptType?:ReceiptType;
    company?: Company;
    recipient?: User;
    executor?: User;
}
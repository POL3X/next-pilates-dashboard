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
    paymentMethod?: PaymentMethod;
    receiptType?:ReceiptType;
    company?: Company;
    recipient?: User;
    executor?: User;
}

export enum PaymentMethod {
    CASH = 'CASH',
    BIZUM = 'BIZUM',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CARD = 'CARD'
  }

  export const paymentMethodLabels: { [key in PaymentMethod]: string } = {
      [PaymentMethod.CASH]: 'Efectivo',
      [PaymentMethod.BIZUM]: 'Bizum',
      [PaymentMethod.BANK_TRANSFER]: 'Transferencia Bancaria',
      [PaymentMethod.CARD]: 'Tarjeta'
  };

  export function getPaymentMethodLabel(method?: PaymentMethod): string {
    return paymentMethodLabels[method ?? PaymentMethod.CASH];
}
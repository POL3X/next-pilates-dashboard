'use server'
import { DateRange } from "react-day-picker";
import { getCookie } from "@/actions/cookies/cookiesAction";
import { Receipt } from "@/constants/Receipt/Receipt";

export async function receipListByRecipientAction(recipientUuid: string | undefined, companyUuid: string | undefined, dateRange: DateRange | undefined, pending: boolean | undefined, charged: boolean | undefined) {
  const initialDate = dateRange?.from
    ? new Date(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate(),
        0, 0, 0, 0
      ).toDateString()
    : undefined;

  let endDate = dateRange?.to
    ? new Date(
        dateRange.to.getFullYear(),
        dateRange.to.getMonth(),
        dateRange.to.getDate(),
        23, 59, 59, 999
      ).toDateString()
    : undefined;

  if (initialDate != undefined && endDate == undefined) {
    endDate = initialDate;
  }

  try {
    const token = await getCookie();
    const params = new URLSearchParams();

    if (recipientUuid) params.append('recipientUuid', recipientUuid);
    if (companyUuid) params.append('companyUuid', companyUuid);
    if (initialDate) params.append('initialDate', initialDate);
    if (endDate) params.append('endDate', endDate);
    if (pending === true) params.append('pending', String(pending));
    if (charged === true) params.append('charged', String(charged));

    const url = `${process.env.NEXT_PUBLIC_BACK_URL}/v1/universal-management/receipt/?${params.toString()}`;

    const messageResponse = await fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token?.value
      },
      cache: 'no-store',
      credentials: 'same-origin'
    });

    if (201 != messageResponse.status) {
      const { error } = await messageResponse.json();
      return { receiptList: [], receiptCountCharged: 0, receiptCountPending: 0 , error: true};
    }

    const { receiptList, receiptCountCharged, receiptCountPending }: { receiptList: Receipt[], receiptCountCharged: number, receiptCountPending: number } = await messageResponse.json();
    return { receiptList, receiptCountCharged, receiptCountPending, error: false};

  } catch (error) {
    return { receiptList: [], receiptCountCharged: 0, receiptCountPending: 0 , error: true};
  }
}
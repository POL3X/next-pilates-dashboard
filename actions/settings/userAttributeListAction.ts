'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { UserAttribute } from "@/constants/UserAttribute/userAttribute";

export async function userAttributeListAction(companyUuid: string, userAttributeUuid: string[]) {

    try {
        const token = await getCookie();

        let url = process.env.NEXT_PUBLIC_BACK_URL + "/v1/user-attribute?companyUuid=" + companyUuid;

        if (userAttributeUuid.length > 0) {
            // Agregar cada valor del array como un parámetro separado
            const usersParams = userAttributeUuid.map(uuid => `excludeAttributes[]=${encodeURIComponent(uuid)}`).join('&');
            url += `&${usersParams}`;
        }

        const messageResponse = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value
            },
            cache: 'no-store',
            credentials: 'same-origin'
        })

        if (201 != messageResponse.status) {
            const { error } = await messageResponse.json();
            throw new Error(error);
        }

        const userAttribute: UserAttribute[] = await messageResponse.json();
        return userAttribute;

    } catch (error) {
        throw (error)
    }
}
'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { GroupAttribute } from "@/constants/GroupAttribute/groupAttribute";

export async function groupAttributeListAction(companyUuid: string, groupAttributeUuid: string[]) {

    try {
        const token = await getCookie();

        let url = process.env.NEXT_PUBLIC_BACK_URL + "/v1/group-attribute?companyUuid=" + companyUuid;

        if (groupAttributeUuid.length > 0) {
            // Agregar cada valor del array como un parámetro separado
            const usersParams = groupAttributeUuid.map(uuid => `excludeAttributes[]=${encodeURIComponent(uuid)}`).join('&');
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

        const groupAttribute: GroupAttribute[] = await messageResponse.json();
        return groupAttribute;

    } catch (error) {
        throw (error)
    }
}
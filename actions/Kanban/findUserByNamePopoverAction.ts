'use server'
import { getCookie, setCookie } from "../cookies/cookiesAction";
import { User } from "@/constants/User/user";

export async function findUserByNamePopoverAction(name: string, usersInGroup: string[], companyRole: string, companyUuid?: string) {

    try {
        const token = await getCookie();

        // No es necesario convertir usersInGroup en una cadena
        // La notación con [] se utilizará para pasarlo como array en la URL

        // Construir la URL con los parámetros principales
        let url = `${process.env.NEXT_PUBLIC_BACK_URL}/v1/group/user?name=${encodeURIComponent(name)}&companyUuid=${encodeURIComponent(companyUuid ?? "")}&companyRole=${encodeURIComponent(companyRole ?? "")}`;

        // Agregar el parámetro usersInGroup[] si existen usuarios
        if (usersInGroup.length > 0) {
            // Agregar cada valor del array como un parámetro separado
            const usersParams = usersInGroup.map(uuid => `usersInGroup[]=${encodeURIComponent(uuid)}`).join('&');
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

        const { usersFormatted, total }: { usersFormatted: User[], total: number } = await messageResponse.json();
        return {usersFormatted, total};

    } catch (error: any) {
       throw (error)
    }
}

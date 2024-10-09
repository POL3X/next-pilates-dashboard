'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { Group } from "@/constants/Group/group";

export async  function createKanbanGroupAction(group: Group){

    try{
        const token = await getCookie();
        let url =  process.env.NEXT_PUBLIC_BACK_URL + "/v1/group";
        const messageResponse = await fetch( url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
                uuid: '',
                companyUuid: group.companyUuid,  // Asigna el UUID de la empresa seleccionada
                categoryUuid: group.categoryUuid, // Asigna el UUID de la categoría seleccionada
                name: group.name, // Asigna el nombre del grupo desde un formulario, por ejemplo
                dayOfWeek: group.dayOfWeek, // Asigna el día de la semana seleccionado
                startTime: group.startTime.toLocaleTimeString(), // Hora de inicio desde un formulario o selección
                duration: group.duration.toLocaleTimeString(), // Duración del grupo (horas/minutos)
                maxUsers: group.maxUsers, // Número máximo de usuarios permitido
            }) 
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }

          const groupR: Group = await messageResponse.json();
          return groupR;
        
    }catch(error){ 
        throw(error)
    }
}
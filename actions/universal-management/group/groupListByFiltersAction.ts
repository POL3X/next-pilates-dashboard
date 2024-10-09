'use server'

import { getCookie } from "@/actions/cookies/cookiesAction";
import { State } from "@/lib/store";
import { GroupFilterUM } from "@/components/universal-management/groups/group-tab";
import { Group } from "@/constants/Group/group";
import { dayNames, dayNamesEn, daySpanishToEnglish } from "@/constants/DayOfWeek";
import { da } from "date-fns/locale";

export async  function groupListByFiltersAction(groupFilter: GroupFilterUM,companyUuid?: string){

    try{
        const token = await getCookie();

        // Objeto de mapeo de días de la semana de español a inglés

        // Convertir los días de la semana a inglés en minúsculas
        const diasSemanaInEnglish = groupFilter.diasSemana.map(dia => {
          const diaMinuscula = dia.toLowerCase();
          return daySpanishToEnglish[diaMinuscula] || diaMinuscula;
        });
          // Construir los parámetros de consulta basados en los filtros
          let queryParams = new URLSearchParams();

          if (groupFilter.groupName) {
              queryParams.append("groupName", groupFilter.groupName);
          }
          if (groupFilter.categorias?.length > 0) {
              queryParams.append("categorias", groupFilter.categorias.join(","));
          }
          if (groupFilter.diasSemana?.length > 0) {
              queryParams.append("diasSemana", diasSemanaInEnglish.join(","));
          }
          if (groupFilter.tagsGrupo?.length > 0) {
              queryParams.append("tagsGrupo", groupFilter.tagsGrupo.join(","));
          }
          if (typeof groupFilter.completo === "boolean") {
              const changeStatus = !groupFilter.completo;
              queryParams.append("completo", changeStatus.toString());
          }
          if (typeof groupFilter.listaEspera === "boolean") {
              queryParams.append("listaEspera", groupFilter.listaEspera.toString());
          }
          if(groupFilter.userSelected != ''){
            queryParams.append("excludeUserUuid", groupFilter.userSelected.toString());

          }
  
          let url = process.env.NEXT_PUBLIC_BACK_URL + "/v1/universal-management/group?companyUuid=" + companyUuid + "&" + queryParams.toString();

        const messageResponse = await fetch( url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token?.value                          
            },
            cache: 'no-store',
            credentials: 'same-origin'
          })
          
          if(201 != messageResponse.status){
            const {error} = await messageResponse.json();
            throw new Error(error);
          }

  
          const {groups, userGroups}: {groups:Group[], userGroups:Group[]}= await messageResponse.json();
          return {groups: groups.sort(compareGroups), userGroups};
        
    }catch(error){ 
        throw(error)
    }
}


const getDayIndex = (day: string) => dayNamesEn.indexOf(day);

const compareGroups = (a: Group, b: Group) => {
  const dayA = getDayIndex(a.dayOfWeek);
  const dayB = getDayIndex(b.dayOfWeek);
  console.log(a.dayOfWeek)
  // Si los días son diferentes, ordena por día
  if (dayA !== dayB) {
    return dayA - dayB;
  }

  // Función para convertir startTime (HH:mm) a un objeto Date con solo hora y minutos
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(1970, 0, 1); // Usar una fecha fija para evitar desajustes de zona horaria
    date.setUTCHours(hours); // Establece las horas y minutos
    date.setUTCMinutes(minutes)
    return date;
  };

  // Si los días son iguales, ordena por hora de inicio
  const timeA = parseTime(a.startTime.toString()).getTime();
  const timeB = parseTime(b.startTime.toString()).getTime();
  
  return timeA - timeB;
};
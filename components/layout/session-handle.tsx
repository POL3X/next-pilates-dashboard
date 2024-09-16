// components/ClientSessionHandler.tsx
"use client";

import { sessionAction } from '@/actions/auth/sessionAction';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserSessionContext from './context/user-session';
import { UserSession } from '@/types/auth';
import { getDefaultCompanyCookie } from '@/actions/cookies/cookiesAction';

function isUserSession(obj: any): obj is UserSession {
  return obj && typeof obj === 'object' && 'uuid' in obj && 'email' in obj;
}
export default function SessionHandle({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userSession, setUserSession] = useState<UserSession | null>(null); // Inicializa con `null` para manejar la carga

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session: UserSession = await sessionAction();
        // Validar la sesión obtenida antes de establecerla
        if (session.uuid != '' || session != null) {
          if(session.company.length < 2){
            session.selectedCompany = session.company[0].uuid
          }else{
            const defaultCompany = await getDefaultCompanyCookie()
            const existCompany = session.company.some(company => company.uuid === defaultCompany?.value);
            session.selectedCompany = existCompany ? defaultCompany?.value : session.company[0].uuid
          }
          setUserSession(session);
        } else {
          throw new Error('Invalid session data');
        }
      } catch (err: any) {
        console.error("Error fetching session:", err);
        router.push('/'); // Redirigir en caso de error
      }
    };

    fetchSession();
  }, []);


// Este efecto se ejecutará cuando `userSession` cambie

  if (userSession === null) {
    return <div>Loading...</div>;
  }

  return (
    <UserSessionContext.Provider value={{userSession, setUserSession}}>
      {children}
    </UserSessionContext.Provider>
  );
}
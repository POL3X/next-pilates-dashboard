// SocketContext.tsx

import { UserSession } from '@/types/auth';
import { createContext, Dispatch, SetStateAction } from 'react';

interface UserSessionContextType {
  userSession: UserSession | null;
  setUserSession: Dispatch<SetStateAction<UserSession | null>>;
}

const UserSessionContext = createContext<UserSessionContextType>({
  userSession: {
    uuid: '',
    role: '',
    name: '',
    company: [
      {
        uuid: '',
        name: '',
        role: '',
      },
    ],
    selectedCompany: '', // Agrega `defaultCompany` aquí si no estaba antes
  },
  setUserSession: () => {}, // Proporciona una función vacía por defecto
});

export default UserSessionContext;

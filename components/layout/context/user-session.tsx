// SocketContext.tsx

import { UserSession } from '@/types/auth';
import { createContext } from 'react';

const UserSessionContext = createContext<UserSession>({
    uuid: '',
    role: '',
    name:'',
    company:[ {
        uuid: '',
        name: '',
        role:''
    },]
});

export default UserSessionContext;
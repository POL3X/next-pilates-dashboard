// SocketContext.tsx

import { UserSession } from '@/types/auth';
import { createContext, Dispatch, SetStateAction } from 'react';

interface KanbanRefresh {
  refresh: number;
  setRefresh: Dispatch<SetStateAction<number>>;
}

const KanbanRefreshContext = createContext<KanbanRefresh>({
  refresh: 0,
    setRefresh: () => {}, // Proporciona una función vacía por defecto
});

export default KanbanRefreshContext;

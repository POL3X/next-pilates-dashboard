'use client'
import { groupListKanbanAction } from '@/actions/Kanban/groupListKanbanAction';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { NewGroupDialog } from '@/components/kanban/new-group-dialog';
import KanbanRefreshContext from '@/components/layout/context/kanban-refresh-context';
import UserSessionContext from '@/components/layout/context/user-session';
import PageContainer from '@/components/layout/page-container';
import PageContainerKanban from '@/components/layout/page-container-kanban';
import { Heading } from '@/components/ui/heading';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ParentColumns, State, Task } from '@/lib/store';
import { useContext, useEffect, useState } from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Kanban', link: '/dashboard/kanban' }
];

export default function Page() {
  const [refresh, setRefresh] = useState<number>(0);
  const [parentColumns, setParentColumns] = useState<ParentColumns[]>();
  const [tasks, setTasks] = useState<Task[]>();
  const userSessionContextType = useContext(UserSessionContext)

  useEffect(() => {
    const fetchGroups = async () => {
      if (userSessionContextType.userSession?.selectedCompany != undefined) {
        const state = await groupListKanbanAction(userSessionContextType.userSession?.selectedCompany);
        setTasks(state.tasks);
        setParentColumns(state.parentColumns);
      }
    };
    fetchGroups();
  }, [userSessionContextType, refresh]);  // Añadir refresh como dependencia para actualizar datos cuando cambie

  // Si parentColumns o tasks son undefined, muestra un loader o nada
  if (!parentColumns || !tasks) {
    return <div>Loading...</div>;  // Puedes personalizar el loader
  }

  return (
    <>
      <div className="p-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Kanban" description="Manage tasks by drag and drop" />
          <NewGroupDialog user={null} setRefresh={setRefresh} />
        </div>
      </div>
      <KanbanRefreshContext.Provider value={{ refresh, setRefresh }}>
        <PageContainerKanban scrollable={true}>
          <div className='space-y-4 h-full max-w-full'>
            <KanbanBoard parentColumnsProp={parentColumns} taskProp={tasks} setRefresh={setRefresh} />
          </div>
        </PageContainerKanban>
      </KanbanRefreshContext.Provider>
    </>
  );
}

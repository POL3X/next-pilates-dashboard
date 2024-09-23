import { Breadcrumbs } from '@/components/breadcrumbs';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import NewTaskDialog from '@/components/kanban/new-task-dialog';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Kanban', link: '/dashboard/kanban' }
];

export default function page() {
  return (

    <>

      <div className="">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Kanban`} description="Manage tasks by dnd" />
          <NewTaskDialog />
        </div>
      </div>
  
      <div className='space-y-4 h-full '>
        <KanbanBoard />
      </div>

    </>

  );
}

import { Task } from '@/lib/store';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { GripVertical, Scroll } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ColumnActions } from './column-action';
import { TaskCard } from './task-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import PageContainer from '../layout/page-container';
import PageContainerKanban from '../layout/page-container-kanban';
import { Group } from '@/constants/Group/group';
import { Badge } from '../ui/badge';
import { group } from 'console';
import { badgeColor } from '../ui/custom/Group/badge-color';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Group;
}

interface BoardColumnProps {
  column: Group;
  tasks: Task[];
  isOverlay?: boolean;
  setRefresh: Dispatch<SetStateAction<number>>
}

export function BoardColumn({ column, tasks, isOverlay, setRefresh }: BoardColumnProps) {
  const { taskNotWaitList, taskInWaitList, taskNoWId, taskWId } = useMemo(() => {
    const taskNotWaitList = tasks.filter((task) => task.waitList == false)
    const taskInWaitList = tasks.filter((task) => task.waitList == true)
    const taskNoWId = taskNotWaitList.map((task) => task.id);
    const taskWId = taskInWaitList.map((task) => task.id);
    return { taskNotWaitList, taskInWaitList, taskNoWId, taskWId };
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.uuid,
    data: {
      type: 'Column',
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.name}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    margin: "0 0 20px 0"
  };

  const variants = cva(
    'w-[350px] max-w-full bg-secondary flex flex-col flex-shrink-0 snap-center',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary'
        }
      }
    }
  );

  const tasksColumn = tasks.filter((task) => (task.status == column.uuid))
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className="flex flex-col border-b-2 p-4 text-left font-semibold">
        <div className='space-between flex flex-row items-center '>
        <ColumnActions id={column.uuid} title={column.name} taskColumns={tasksColumn} setRefresh={setRefresh} />
        </div>
        <div className='flex justify-end'>
          <Badge variant={"outline"} className={badgeColor(taskNotWaitList.length, column.maxUsers)}>{taskNotWaitList.length + "/" + column.maxUsers}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-1 p-2">
        <SortableContext items={taskNoWId}>
          {taskNotWaitList.map((task) => {
            if (task.waitList == false) {
              return (<TaskCard key={task.id} task={task} />)
            }
          })}
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={"accordion"}>
            <AccordionTrigger className='flex flex-row justify-between'>
              <div className='w-full flex flex-row justify-between'>
                <h4>Lista de espera</h4>
              <Badge variant={"outline"} className="border-blue-500 text-blue-500"  >{taskInWaitList.length}</Badge>
              </div>
              </AccordionTrigger>
            <AccordionContent>
            <SortableContext items={taskWId}>
              {taskInWaitList.map((task) => {
                if (task.waitList == true) {
                  return (<TaskCard key={task.id} task={task} />)
                }
              })}
            </SortableContext>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        </SortableContext>
      </CardContent>

    </Card>
    
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('px-2 pb-4 md:px-0 flex lg:justify-start', {
    variants: {
      dragging: {
        default: '',
        active: 'snap-none'
      }
    }
  });

  return (

    <div
      className={variations({
        dragging: dndContext.active ? 'active' : 'default',
      })}
    >
      <div className="flex flex-col items-start justify-center h-full gap-4 ">
        {children}
      </div>
    </div>
  );
}

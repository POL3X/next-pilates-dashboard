import { Task } from '@/lib/store';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ColumnActions } from './column-action';
import { TaskCard } from './task-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Group } from '@/constants/Group/group';
import { Badge } from '../ui/badge';
import { badgeColor } from '../ui/custom/Group/badge-color';
import { getTextColorBasedOnBackground } from '@/lib/utils';
import { Icons } from '../icons';
import { deleteGroupGroupAttributeAction } from '@/actions/Kanban/deleteGroupGroupAttributeAction';

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
  companyUuid: string
}

export function BoardColumn({ column, tasks, isOverlay, setRefresh, companyUuid }: BoardColumnProps) {
  const { taskNotWaitList, taskInWaitList, taskNoWId, taskWId } = useMemo(() => {
    const taskNotWaitList = tasks.filter((task) => task.waitList == false)
    const taskInWaitList = tasks.filter((task) => task.waitList == true)
    const taskNoWId = taskNotWaitList.map((task) => task.id);
    const taskWId = taskInWaitList.map((task) => task.id);
    return { taskNotWaitList, taskInWaitList, taskNoWId, taskWId };
  }, [tasks]);
  console.log(column)
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

  const DeleteIcon = Icons['close'];

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

  const deleteTag = async (groupAttributeUuid: string) => {
    await deleteGroupGroupAttributeAction(groupAttributeUuid, column.uuid, companyUuid)
    setRefresh(Math.random())
  }

  const tasksColumn = tasks.filter((task) => (task.status == column.uuid))
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className="flex flex-col border-b-2 p-4 text-left font-semibold gap-2">
        <div className='space-between flex flex-row items-center '>
          <ColumnActions id={column.uuid} title={column.name} taskColumns={tasksColumn} setRefresh={setRefresh} group={column} />
        </div>
        <div className='flex flex-row justify-between '>
          <ScrollArea className='pb-3 w-[250px]'>
            <div className='flex flex-row gap-4'>
              {column.groupGroupAttribute?.map((value) => {
                return (
                  <div className=' flex flex-row items-center gap-1'>
                    <div
                      className="flex flex-row items-center p-1 rounded"
                      style={{
                        backgroundColor: value.groupAttribute?.color,
                      }}
                    >
                      <p
                        className="text-[12px]"
                        style={{ color: getTextColorBasedOnBackground(value.groupAttribute?.color!) }}
                      >
                        {value.groupAttribute?.title}
                      </p>
                      <Button variant='link' className="w-4 h-3" size={'icon'}><DeleteIcon size={10} color={getTextColorBasedOnBackground(value.groupAttribute?.color!)}
                      onClick={() => deleteTag(value.groupAttributeUuid)}
                      ></DeleteIcon></Button>
                    </div>
                  </div>)
              })}
            </div>
            <ScrollBar orientation='horizontal'></ScrollBar>
          </ScrollArea>
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

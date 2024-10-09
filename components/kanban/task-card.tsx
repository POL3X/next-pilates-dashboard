import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Task } from '@/lib/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { GripVertical } from 'lucide-react';
import { Badge } from '../ui/badge';
import { TaskActions } from './task-actions';

// export interface Task {
//   id: UniqueIdentifier;
//   columnId: ColumnId;
//   content: string;
// }

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task'
    }
  });

  const bgColor = () =>{
    if(task.waitList){
      return "#bfdbfe"
    }
    return ""
  }

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    background: bgColor()
  };

  const variants = cva('', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary'
      }
    }
  });

 

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardContent className={"max-h-[40px] min-h-[40px] justify-between relative items-center flex flex-row border-b-2 p-2"}>
      <div className='flex flex-row items-center'>
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className="h-auto cursor-grab p-1 text-secondary-foreground/50"
        >
          <span className="sr-only ">Mover usuario</span>
          <GripVertical />
        </Button>
        <span className='text-xs'>{task.title}</span></div>
      
        <TaskActions task={task}></TaskActions>
      </CardContent>
    </Card>
  );
}

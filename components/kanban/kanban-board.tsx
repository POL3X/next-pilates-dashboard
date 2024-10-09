'use client';
import { Dispatch, Fragment, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { ParentColumns, Task, useTaskStore } from '@/lib/store';
import { hasDraggableData } from '@/lib/utils';
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import type { Column } from './board-column';
import { BoardColumn, BoardContainer } from './board-column';
import NewSectionDialog from './new-section-dialog';
import { TaskCard } from './task-card';
import { Group } from '@/constants/Group/group';
import { groupListKanbanAction } from '@/actions/Kanban/groupListKanbanAction';
import { changeUserGroupAction } from '@/actions/Kanban/changeUserGroupAction';
import UserSessionContext from '../layout/context/user-session';

export type ColumnId = UniqueIdentifier;

interface Props {
  parentColumnsProp: ParentColumns[],
  taskProp: Task[],
  setRefresh: Dispatch<SetStateAction<number>>
}

export function KanbanBoard({parentColumnsProp, taskProp, setRefresh}: Props) {
  // Obtener todas las columnas padre y columnas hijo
  //Hay que traer desde el back, la estructura correcta para mostrar los parentcolumns
  const parentColumns: ParentColumns[] =  parentColumnsProp;
  const setColumns = useTaskStore((state) => state.setCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const setParentColumns = useTaskStore((state) => state.setParentCol)
  setParentColumns(parentColumnsProp)
  const setTasks = useTaskStore((state) => state.setTasks);
  setTasks(taskProp)
  const tasks = useTaskStore((state) => state.tasks);
  const [activeColumn, setActiveColumn] = useState<Group | null>(null);
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [originalTaskStatus, setOriginalTaskStatus] = useState<string>();
  const userSessionContextType = useContext(UserSessionContext)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    useTaskStore.persist.rehydrate();
  }, []);
  if (!isMounted) return;


  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.status === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);

    // Buscar la columna a la que pertenece la tarea en todas las columnas padre
    const column = parentColumns
      .flatMap((parent) => parent.columns)
      .find((col: Group) => col.uuid.toString() === columnId.toString());
    return {
      tasksInColumn,
      taskPosition,
      column
    };
  }


  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
  
      // Asegurarnos de trabajar con columnas dentro de los parentColumns
      const allColumns = parentColumns.flatMap((parent) => parent.columns);
  
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = allColumns.findIndex((col) => col.uuid === active.id);
        const startColumn = allColumns[startColumnIdx];
        return `Picked up Column ${startColumn?.name} at position: ${
          startColumnIdx + 1
        } of ${allColumns.length}`;
      } else if (active.data.current?.type === 'Task') {
  
        // Verificar que pickedUpTaskColumn.current no sea null
        if (pickedUpTaskColumn.current) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            active.id,
            pickedUpTaskColumn.current
          );
          return `Picked up Task ${active.data.current.task.title} at position: ${
            taskPosition + 1
          } of ${tasksInColumn.length} in column ${column?.name}`;
        }
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;
  
      // Obtener todas las columnas de los parentColumns
      const allColumns = parentColumns.flatMap((parent) => parent.columns);
  
      if (active.data.current?.type === 'Column' && over.data.current?.type === 'Column') {
        const overColumnIdx = allColumns.findIndex((col) => col.uuid === over.id);
        return `Column ${active.data.current.column.name} was moved over ${
          over.data.current.column.name
        } at position ${overColumnIdx + 1} of ${allColumns.length}`;
      } else if (active.data.current?.type === 'Task' && over.data.current?.type === 'Task') {
        
        // Verificar que pickedUpTaskColumn.current no sea null
        if (pickedUpTaskColumn.current) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            over.id,
            over.data.current.task.status
          );
          if (over.data.current.task.status !== pickedUpTaskColumn.current) {
            return `Task ${active.data.current.task.title} was moved over column ${
              column?.name
            } in position ${taskPosition + 1} of ${tasksInColumn.length}`;
          }
          return `Task was moved over position ${taskPosition + 1} of ${tasksInColumn.length} in column ${column?.name}`;
        }
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
  
      // Obtener todas las columnas de los parentColumns
      const allColumns = parentColumns.flatMap((parent) => parent.columns);
  
      if (active.data.current?.type === 'Column' && over.data.current?.type === 'Column') {
        const overColumnPosition = allColumns.findIndex((col) => col.uuid === over.id);
        return `Column ${active.data.current.column.name} was dropped into position ${overColumnPosition + 1} of ${allColumns.length}`;
      } else if (active.data.current?.type === 'Task' && over.data.current?.type === 'Task') {
        
        // Verificar que pickedUpTaskColumn.current no sea null
        if (pickedUpTaskColumn.current) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            over.id,
            over.data.current.task.status
          );
          if (over.data.current.task.status !== pickedUpTaskColumn.current) {
            return `Task was dropped into column ${column?.name} in position ${
              taskPosition + 1
            } of ${tasksInColumn.length}`;
          }
          return `Task was dropped into position ${taskPosition + 1} of ${tasksInColumn.length} in column ${column?.name}`;
        }
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    }
  };

  return (
    <DndContext
      accessibility={{
        announcements
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
      <div className='flex flex-row h-full gap-4'>
        {parentColumns.map((parentCol, parentIndex) => (
          <Fragment key={parentCol.day}>
              <div className='flex flex-col'>
            <h2>{parentCol.day}</h2>
            <SortableContext  items={parentCol.columns.map((col) => col.uuid)}>
              {parentCol.columns.map((col: Group, index: number) => (
              <div key={"key: " + col.uuid} className='flex flex-col gap-4'>
                <Fragment key={col.uuid}>
                  <BoardColumn
                    column={col}
                    tasks={tasks.filter((task) => task.status === col.uuid)}
                    setRefresh={setRefresh}
                  />  
                  {index === parentCol.columns.length - 1 && (
                <></>
                  )}
                </Fragment>
                </div>
              ))}
            </SortableContext>
            </div>
          </Fragment>
        ))}
        
        {!parentColumns.length && <NewSectionDialog />}
        </div>
      </BoardContainer>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter((task) => task.status === activeColumn.uuid)}
                setRefresh={setRefresh}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>

  );
    // Guardaremos el estado original aquí.

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    
    // Si es una tarea, guardamos el estado original.
    if (data?.type === 'Task') {
      setActiveTask(data.task);
      pickedUpTaskColumn.current = data.task.status;
      setOriginalTaskStatus(data.task.status)  // Actualizamos la columna de la tarea
      return;
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    console.log('he terminado el over');
  
    const { active, over } = event;
    if (!over) {
      // Si no se soltó sobre una columna, restauramos el estado original.
      if (active.data.current?.type === 'Task') {
        const activeTask = tasks.find((t) => t.id === active.id);
        if (activeTask) {
          activeTask.status = originalTaskStatus!;  // Restauramos el estado original.
          setTasks([...tasks]);  // Actualizamos las tareas para reflejar la restauración.
        }
      }
      return;
    }
    const activeId = active.id;
    const overId = over.id;
    if (!hasDraggableData(active)) return;
    const activeData = active.data.current;
    if (activeId === overId) return;
    await changeUserGroupAction(originalTaskStatus, active.data.current?.task, over.data.current?.type === 'Task' ? over.data.current.task.status : overId.toString()  , userSessionContextType.userSession?.selectedCompany);
  }
  

  function onDragOver(event: DragOverEvent) {

    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
  
    if (!hasDraggableData(active) || !hasDraggableData(over)) return;
  
    const activeData = active.data.current;
    const overData = over.data.current;
  
    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = overData?.type === 'Task';
    const isOverAColumn = overData?.type === 'Column';

    if (!isActiveATask) return;
    // Previsualización cuando una tarea se arrastra sobre otra tarea
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      const duplicateTask = tasks.find((t) => (overData.task.status == t.status && activeData.task.uuid == t.uuid))
      if(!duplicateTask){
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (activeTask && overTask && activeTask.status !== overTask.status) {
          activeTask.status = overTask.status;
          setTasks(arrayMove(tasks, activeIndex, overIndex - 1));
        }
        setTasks(arrayMove(tasks, activeIndex, overIndex));
      }
      // Simular previsualización cambiando temporalmente el estado
    }
  
    // Previsualización cuando se arrastra una tarea sobre una columna
    if (isActiveATask && isOverAColumn) {
      const duplicateTask = tasks.find((t) => (overData.column.uuid == t.status && activeData.task.uuid == t.uuid))
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const activeTask = tasks[activeIndex];
      if(!duplicateTask){
        if (activeTask) {
          const overColumnId = overId as ColumnId;
          // Cambiar el estado de la tarea temporalmente para mostrar la previsualización
          activeTask.status = overColumnId.toString();
          setTasks(arrayMove(tasks, activeIndex, activeIndex));
        }
      }
      
    }
  }
}

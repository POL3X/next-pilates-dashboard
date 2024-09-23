'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
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

export type ColumnId = string;



export function KanbanBoard() {
  // Obtener todas las columnas padre y columnas hijo
  const parentColumns = useTaskStore((state) => state.parentColumns);
  const setColumns = useTaskStore((state) => state.setCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);

  // Obtener las tareas
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
      .find((col: Column) => col.id.toString() === columnId.toString());

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
        const startColumnIdx = allColumns.findIndex((col) => col.id === active.id);
        const startColumn = allColumns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
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
          } of ${tasksInColumn.length} in column ${column?.title}`;
        }
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;
  
      // Obtener todas las columnas de los parentColumns
      const allColumns = parentColumns.flatMap((parent) => parent.columns);
  
      if (active.data.current?.type === 'Column' && over.data.current?.type === 'Column') {
        const overColumnIdx = allColumns.findIndex((col) => col.id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${allColumns.length}`;
      } else if (active.data.current?.type === 'Task' && over.data.current?.type === 'Task') {
        
        // Verificar que pickedUpTaskColumn.current no sea null
        if (pickedUpTaskColumn.current) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            over.id,
            over.data.current.task.id
          );
          if (over.data.current.task.status !== pickedUpTaskColumn.current) {
            return `Task ${active.data.current.task.title} was moved over column ${
              column?.title
            } in position ${taskPosition + 1} of ${tasksInColumn.length}`;
          }
          return `Task was moved over position ${taskPosition + 1} of ${tasksInColumn.length} in column ${column?.title}`;
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
        const overColumnPosition = allColumns.findIndex((col) => col.id === over.id);
        return `Column ${active.data.current.column.title} was dropped into position ${overColumnPosition + 1} of ${allColumns.length}`;
      } else if (active.data.current?.type === 'Task' && over.data.current?.type === 'Task') {
        
        // Verificar que pickedUpTaskColumn.current no sea null
        if (pickedUpTaskColumn.current) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            over.id,
            over.data.current.task.id
          );
          if (over.data.current.task.status !== pickedUpTaskColumn.current) {
            return `Task was dropped into column ${column?.title} in position ${
              taskPosition + 1
            } of ${tasksInColumn.length}`;
          }
          return `Task was dropped into position ${taskPosition + 1} of ${tasksInColumn.length} in column ${column?.title}`;
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
            <SortableContext  items={parentCol.columns.map((col) => col.id)}>
              {parentCol.columns.map((col: Column, index: number) => (
              <div className='flex flex-col gap-4'>
                <Fragment key={col.id}>
                  <BoardColumn
                    column={col}
                    tasks={tasks.filter((task) => task.status === col.id)}
                  />  
                  {index === parentCol.columns.length - 1 && (
                    <div className="w-[300px]">
                      <NewSectionDialog />
                    </div>
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
                tasks={tasks.filter((task) => task.status === activeColumn.id)}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>

  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const activeColumnIndex = parentColumns
      .flatMap((parent) => parent.columns)
      .findIndex((col: { id: UniqueIdentifier }) => col.id === activeId);

    const overColumnIndex = parentColumns
      .flatMap((parent) => parent.columns)
      .findIndex((col: { id: UniqueIdentifier }) => col.id === overId);

    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      const parentDay = parentColumns.find((parent) =>
        parent.columns.some((col) => col.id === activeId)
      )?.day;

      if (parentDay) {
        setColumns(parentDay, arrayMove(
          parentColumns.find((parent) => parent.day === parentDay)?.columns || [],
          activeColumnIndex,
          overColumnIndex
        ));
      }
    }
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

    if (!isActiveATask) return;

    // Estoy arrastrando una tarea sobre otra tarea
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      const activeTask = tasks[activeIndex];
      const overTask = tasks[overIndex];
      if (activeTask && overTask && activeTask.status !== overTask.status) {
        activeTask.status = overTask.status;
        setTasks(arrayMove(tasks, activeIndex, overIndex - 1));
      }

      setTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    const isOverAColumn = overData?.type === 'Column';

    // Estoy arrastrando una tarea sobre una columna
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const activeTask = tasks[activeIndex];
      if (activeTask) {
        activeTask.status = overId as ColumnId;
        setTasks(arrayMove(tasks, activeIndex, activeIndex));
      }
    }
  }
}

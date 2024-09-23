import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { Column } from '@/components/kanban/board-column';
import { UniqueIdentifier } from '@dnd-kit/core';

export type Status = string;

const defaultCols = [
  {
    columns: [{
      id: '205e0143-b656-482e-ab4f-e42b415e0995' as const,
      title: 'Lunes - 9:00'
    }],
    day: 'Lunes'
  },
  {
    columns: [{
      id: '82946b5b-6a8d-46b1-9a9f-ae5ea47b5315' as const,
      title: 'Martes - 9:00'
    }],
    day: 'Martes'
  },
  {
    columns: [{
      id: 'e1740826-5643-45bf-9ffb-d8357c1da6fd' as const,
      title: 'Miercoles - 9:00'
    }],
    day: 'Miercoles'
  },
  {
    columns: [{
      id: '69929c72-9f9c-4bff-b581-baaf64acdb3a' as const,
      title: 'Jueves - 9:00'
    }],
    day: 'Jueves'
  },
  {
    columns: [{
      id: '3f5e5350-7d77-41da-9853-1e9f220ff3e7' as const,
      title: 'Viernes - 9:00'
    }],
    day: 'Viernes'
  },
  
] satisfies ParentColumns[];

export type ColumnId = (typeof defaultCols)[number]['columns'][0]['id'];

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

export type ParentColumns = {
  columns: Column[];
  day: string;
};

export type State = {
  tasks: Task[];
  parentColumns: ParentColumns[];
  draggedTask: string | null;
};

const initialTasks: Task[] = [
  {
    id: 'bb162274-c797-4d2a-b022-b185e06efe45',
    status: '205e0143-b656-482e-ab4f-e42b415e0995',
    title: 'MARIA JOSE BERENJENA',
  },
  {
    id: '41379d20-f071-478f-a7d8-8b3352c093ec',
    status: '205e0143-b656-482e-ab4f-e42b415e0995',
    title: 'PEPE LOBATO',
  },
];

export type Actions = {
  addTask: (title: string, description?: string) => void;
  addCol: (day: string, title: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (id: string) => void;
  removeCol: (day: string, id: UniqueIdentifier) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (day: string, cols: Column[]) => void;
  updateCol: (day: string, id: UniqueIdentifier, newName: string) => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      parentColumns: defaultCols,
      draggedTask: null,
      addTask: (title: string, description?: string) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: uuid(), title, description, status: 'TODO' },
          ],
        })),
      updateCol: (day: string, id: UniqueIdentifier, newName: string) =>
        set((state) => ({
          parentColumns: state.parentColumns.map((parentCol) =>
            parentCol.day === day
              ? {
                  ...parentCol,
                  columns: parentCol.columns.map((col) =>
                    col.id === id ? { ...col, title: newName } : col
                  ),
                }
              : parentCol
          ),
        })),
      addCol: (day: string, title: string) =>
        set((state) => ({
          parentColumns: state.parentColumns.map((parentCol) =>
            parentCol.day === day
              ? {
                  ...parentCol,
                  columns: [
                    ...parentCol.columns,
                    { title, id: title.toUpperCase() },
                  ],
                }
              : parentCol
          ),
        })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      removeCol: (day: string, id: UniqueIdentifier) =>
        set((state) => ({
          parentColumns: state.parentColumns.map((parentCol) =>
            parentCol.day === day
              ? {
                  ...parentCol,
                  columns: parentCol.columns.filter((col) => col.id !== id),
                }
              : parentCol
          ),
        })),
      setTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
      setCols: (day: string, newCols: Column[]) =>
        set((state) => ({
          parentColumns: state.parentColumns.map((parentCol) =>
            parentCol.day === day
              ? { ...parentCol, columns: newCols }
              : parentCol
          ),
        })),
    }),
    { name: 'task-store', skipHydration: true }
  )
);

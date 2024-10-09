import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { Group } from '@/constants/Group/group';
import { UniqueIdentifier } from '@dnd-kit/core';

export type Status = string;

const defaultCols = [
  {
    columns: [
      {
        uuid: '205e0143-b656-482e-ab4f-e42b415e0995',
        companyUuid: '',  // Asigna el UUID de la empresa seleccionada
        categoryUuid:'', // Asigna el UUID de la categoría seleccionada
        name: '', // Asigna el nombre del grupo desde un formulario, por ejemplo
        dayOfWeek: 'Monday', // Asigna el día de la semana seleccionado
        startTime: new Date(), // Hora de inicio desde un formulario o selección
        duration: new Date(), // Duración del grupo (horas/minutos)
        maxUsers: 0, // Número máximo de usuarios permitido
      }
    ],
    day: 'Lunes'
  },
  {
    columns: [
      {
        uuid: '8dc394f9-a67d-4802-a13b-7f7daa389999',
        companyUuid: '',  // Asigna el UUID de la empresa seleccionada
        categoryUuid:'', // Asigna el UUID de la categoría seleccionada
        name: '', // Asigna el nombre del grupo desde un formulario, por ejemplo
        dayOfWeek: 'Monday', // Asigna el día de la semana seleccionado
        startTime: new Date(), // Hora de inicio desde un formulario o selección
        duration: new Date(), // Duración del grupo (horas/minutos)
        maxUsers: 0, // Número máximo de usuarios permitido
      }
    ],
    day: 'Martes'
  },
  {
    columns: [
      {
        uuid: '456709df-ebca-4329-8094-429a9455d23c',
        companyUuid: '',  // Asigna el UUID de la empresa seleccionada
        categoryUuid:'', // Asigna el UUID de la categoría seleccionada
        name: '', // Asigna el nombre del grupo desde un formulario, por ejemplo
        dayOfWeek: 'Monday', // Asigna el día de la semana seleccionado
        startTime: new Date(), // Hora de inicio desde un formulario o selección
        duration: new Date(), // Duración del grupo (horas/minutos)
        maxUsers: 0, // Número máximo de usuarios permitido
      }
    ],
    day: 'Miercoles'
  },
  {
    columns: [
      {
        uuid: '9d4c7f3c-9615-4dc6-9361-70e3a25b8fb0',
        companyUuid: '',  // Asigna el UUID de la empresa seleccionada
        categoryUuid:'', // Asigna el UUID de la categoría seleccionada
        name: '', // Asigna el nombre del grupo desde un formulario, por ejemplo
        dayOfWeek: 'Monday', // Asigna el día de la semana seleccionado
        startTime: new Date(), // Hora de inicio desde un formulario o selección
        duration: new Date(), // Duración del grupo (horas/minutos)
        maxUsers: 0, // Número máximo de usuarios permitido
      }
    ],
    day: 'Jueves'
  },
  {
    columns: [
      {
        uuid: 'f70521e7-b139-4de9-a9e9-aaaef70ce9fe',
        companyUuid: '',  // Asigna el UUID de la empresa seleccionada
        categoryUuid:'', // Asigna el UUID de la categoría seleccionada
        name: '', // Asigna el nombre del grupo desde un formulario, por ejemplo
        dayOfWeek: 'Monday', // Asigna el día de la semana seleccionado
        startTime: new Date(), // Hora de inicio desde un formulario o selección
        duration: new Date(), // Duración del grupo (horas/minutos)
        maxUsers: 0, // Número máximo de usuarios permitido
      }
    ],
    day: 'Viernes'
  },

] satisfies ParentColumns[];

export type ColumnId = (typeof defaultCols)[number]['columns'][0]['uuid'];

export type Task = {
  id: UniqueIdentifier;
  uuid: string;
  title: string;
  description?: string;
  status: Status;
  waitList: boolean;
};

export type ParentColumns = {
  columns: Group[];
  day: string;
};

export type State = {
  tasks: Task[];
  parentColumns: ParentColumns[];
  draggedTask: string | null;
};


export type Actions = {
  addTask: (title: string,uuid:string,status:string , waitList: boolean, description?: string) => void;
  addCol: (day: string, group: Group) => void;
  dragTask: (id: string | null) => void;
  removeTask: (id: string) => void;
  removeCol: (day: string, uuid: string) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (day: string, cols: Group[]) => void;
  updateCol: (day: string, uuid: string, newName: string) => void;
  setParentCol: (parentColumns: ParentColumns[]) => void
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set) => ({
      tasks: [],
      parentColumns: [],
      draggedTask: null,
      addTask: (title: string,uuid:string,status:string , waitList: boolean, description?: string) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: state.tasks.length + 1 , uuid: uuid, title, description, status: status, waitList: waitList },
          ],
        })),
        updateCol: (day: string, uuid: string, newName: string) =>
          set((state) => ({
            parentColumns: state.parentColumns.map((parentCol) =>
              parentCol.day === day
                ? {
                    ...parentCol,
                    columns: parentCol.columns.map((group) =>
                      group.uuid === uuid ? { ...group, name: newName } : group
                    ),
                  }
                : parentCol
            ),
          })),
        addCol: (day: string, group: Group) =>
          set((state) => ({
            parentColumns: state.parentColumns.map((parentCol) =>
              parentCol.day === day
                ? {
                    ...parentCol,
                    columns: [...parentCol.columns, group], // Inserta el objeto group en el array 'columns'
                  }
                : parentCol
            ),
          })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
        removeCol: (day: string, uuid: string) =>
          set((state) => ({
            parentColumns: state.parentColumns.map((parentCol) =>
              parentCol.day === day
                ? {
                    ...parentCol,
                    columns: parentCol.columns.filter((group) => group.uuid !== uuid), // Filtra los grupos cuyo uuid no coincide
                  }
                : parentCol
            ),
          })),
      setTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
      setCols: (day: string, newCols: Group[]) =>
        set((state) => ({
          parentColumns: state.parentColumns.map((parentCol) =>
            parentCol.day === day
              ? { ...parentCol, columns: newCols } // Actualiza 'columns' con 'newCols'
              : parentCol
          ),
        })),
        setParentCol: (parentColumns: ParentColumns[]) =>
          set((state) => ({
            parentColumns: parentColumns  // Asegúrate de que sea un array
          })),
    }),
    { name: 'task-store', skipHydration: true }
  )
);

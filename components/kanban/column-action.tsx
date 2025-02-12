'use client';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Task, useTaskStore } from '@/lib/store';
import { UniqueIdentifier } from '@dnd-kit/core';

import { ComboboxPopoverAddUser } from '../ui/custom/Kanban/combobox/ComboBoxPopoverAddUser';
import { ComboboxGroupGroupAttibute } from '../ui/custom/Kanban/combobox/combobox-group-attribute';
import { Group } from '@/constants/Group/group';
import EditGroupKanbanDialog from './dialog/edit-group';
import { useContext } from 'react';
import KanbanRefreshContext from '../layout/context/kanban-refresh-context';
import DuplicateGroupKanbanDialog from './dialog/duplicate-group';

export function ColumnActions({
  title,
  id,
  taskColumns,
  setRefresh,
  group
}: {
  title: string;
  id: UniqueIdentifier;
  taskColumns: Task[],
  setRefresh: React.Dispatch<React.SetStateAction<number>>,
  group: Group
}) {
  const [editGroupForm, setEditGroupForm] = React.useState<Group>(group)
  const [openEditModal, setOpenEditModal] = React.useState<boolean>(false)
  const [openDuplicateModal, setOpenDuplicateModal] = React.useState<boolean>(false)
  const [duplicateGroupForm, setDuplicateGroupForm] = React.useState<Group>(group)

  const removeCol = useTaskStore((state) => state.removeCol);
  const [editDisable, setIsEditDisable] = React.useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const kanbanRefreshContext = useContext(KanbanRefreshContext)
  const formatTimeWithoutTimezone = (time: any): string => {
    // Asegúrate de que el formato sea "HH:mm:ss" o similar
    const [hours, minutes] = time.split(':');
    // Devuelve el formato "HH:mm"
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };
console.log(taskColumns)
  return (
    <>
      <div className='flex flex-row justify-between w-[100%]'>
        <div className='flex items-center'>
           <p>{formatTimeWithoutTimezone(group.startTime) + ' - ' + title + ' - ' + group.category?.name} </p>
          </div>

        <div className='flex flex-row'>
          <ComboboxPopoverAddUser taskColumns={taskColumns} groupUuid={id.toString()} setRefresh={setRefresh}></ComboboxPopoverAddUser>
          <ComboboxGroupGroupAttibute group={group} groupUuid={id.toString()} setRefresh={setRefresh}></ComboboxGroupGroupAttibute>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="ml-1">
                <span className="sr-only">Acciones</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  setIsEditDisable(!editDisable);
                  setOpenEditModal(!openEditModal);
                  setTimeout(() => {
                    inputRef.current && inputRef.current?.focus();
                  }, 500);
                }}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setIsEditDisable(!editDisable);
                  setOpenDuplicateModal(!openEditModal);
                  setTimeout(() => {
                    inputRef.current && inputRef.current?.focus();
                  }, 500);
                }}
              >
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Seguro que quieres eliminar el grupo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              NOTA: Todas las asociaciones de usuarios a este grupo se eliminaran.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                // yes, you have to set a timeout
                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                setShowDeleteDialog(false);
                removeCol('Lunes', id.toString());
                toast({
                  description: 'This column has been deleted.'
                });
              }}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditGroupKanbanDialog editGroupForm={editGroupForm} setEditGroupForm={setEditGroupForm} user={null} setOpen={setOpenEditModal} open={openEditModal} setRefresh={kanbanRefreshContext.setRefresh}></EditGroupKanbanDialog>
      <DuplicateGroupKanbanDialog duplicateGroupForm={duplicateGroupForm} setDuplicateGroupForm={setDuplicateGroupForm} taskColumns={taskColumns} user={null} setOpen={setOpenDuplicateModal} open={openDuplicateModal} setRefresh={kanbanRefreshContext.setRefresh}></DuplicateGroupKanbanDialog>

    </>
  );
}

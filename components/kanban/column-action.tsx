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
  const removeCol = useTaskStore((state) => state.removeCol);
  const [editDisable, setIsEditDisable] = React.useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const kanbanRefreshContext = useContext(KanbanRefreshContext)
  const formatTimeWithoutTimezone = (time: any): string => {
    // Asegúrate de que el formato sea "HH:mm:ss" o similar
    console.log( "ESTA ES LA HORA " + time)
    const [hours, minutes] = time.split(':');
    // Devuelve el formato "HH:mm"
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

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
                <span className="sr-only">Actions</span>
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
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                Delete Section
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure want to delete column?
            </AlertDialogTitle>
            <AlertDialogDescription>
              NOTE: All tasks related to this category will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditGroupKanbanDialog editGroupForm={editGroupForm} setEditGroupForm={setEditGroupForm} user={null} setOpen={setOpenEditModal} open={openEditModal} setRefresh={kanbanRefreshContext.setRefresh}></EditGroupKanbanDialog>
    </>
  );
}

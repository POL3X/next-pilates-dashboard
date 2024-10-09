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
import { Input } from '../ui/input';
import { Icons } from '../icons';
import {  ComboboxPopoverAddUser } from '../ui/custom/Kanban/combobox/ComboBoxPopoverAddUser';

export function ColumnActions({
  title,
  id,
  taskColumns,
  setRefresh,
}: {
  title: string;
  id: UniqueIdentifier;
  taskColumns: Task[],
  setRefresh:React.Dispatch<React.SetStateAction<number>>
}) {
  const [open, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState(title);
  const updateCol = useTaskStore((state) => state.updateCol);
  const removeCol = useTaskStore((state) => state.removeCol);
  const [editDisable, setIsEditDisable] = React.useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsEditDisable(!editDisable);
          updateCol('Lunes',id.toString(), name);
          toast({
            title: 'Name Updated',
            variant: 'default',
            description: `${title} updated to ${name}`
          });
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="!mt-0 mr-auto text-base disabled:cursor-pointer disabled:border-none disabled:opacity-100"
          disabled={editDisable}
          ref={inputRef}
        />
      </form>
      <ComboboxPopoverAddUser taskColumns={taskColumns} groupUuid={id.toString()} setRefresh={setRefresh}></ComboboxPopoverAddUser>
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
                removeCol('Lunes',id.toString());
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
    </>
  );
}

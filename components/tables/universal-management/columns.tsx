'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/constants/User/user';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    cell: ({ row, table }) => (
      row.original.status == "DISABLE"?  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-red-500"/> : <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500" />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Nombre'
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div
        onClick={(event) => event.stopPropagation()} // Evita que el clic en el botón de acciones seleccione la fila
      >
        <CellAction data={row.original} />
      </div>
    )
  }
];


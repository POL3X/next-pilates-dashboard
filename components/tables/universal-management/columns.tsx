'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/constants/User/user';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()} // Esto se puede eliminar si no necesitas la selección de todas las filas
        onCheckedChange={(value) => {
          const isChecked = !!value;
          if (isChecked) {
            const allRows = table.getRowModel().rows;
            allRows.forEach((row) => row.toggleSelected(false)); // Desselecciona todas las filas antes de seleccionar una nueva
          }
        }}
        aria-label="Select all"
        disabled // Deshabilita la selección de todas las filas
      />
    ),
    cell: ({ row, table }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          const isChecked = !!value;
          if (isChecked) {
            const allRows = table.getRowModel().rows;
            allRows.forEach((otherRow) => {
              if (otherRow.id !== row.id) {
                otherRow.toggleSelected(false); // Desselecciona todas las demás filas
              }
            });
            row.toggleSelected(true); // Selecciona solo la fila actual
          } else {
            row.toggleSelected(false); // Deselecciona la fila actual
          }
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'status',
    header: 'STATUS'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];


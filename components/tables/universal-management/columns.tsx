'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/constants/User/user';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
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


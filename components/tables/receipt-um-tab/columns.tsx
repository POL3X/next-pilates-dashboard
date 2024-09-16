'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Receipt } from '@/constants/Receipt/Receipt';
import { Badge } from '@/components/ui/badge';
import { monthNames } from '@/constants/MonthNames';

export const columns: ColumnDef<Receipt>[] = [
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
    accessorKey: 'createdAt',
    header: 'PERIODO',
    cell: ({row}) => {
      const receipt = row.original
      return <><p>{receipt.createdAt != undefined ? monthNames[new Date(receipt.createdAt).getMonth()] +" " +new Date(receipt.createdAt).getFullYear() : '-'}</p></> 
    }
  },
  {
    accessorKey: 'status',
    header: 'ESTADO',
    cell: ({row}) => {
      const receipt = row.original
      console.log(receipt.status)
      if(receipt.status == 'PENDING'){
        return <Badge className='bg-blue-200 text-blue-800'>Pendiente</Badge>
      }else{
        return <Badge className='bg-green-200 text-green-800'>Cobrado</Badge>
      }
    }
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


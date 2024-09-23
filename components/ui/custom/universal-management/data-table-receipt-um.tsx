'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ScrollArea, ScrollBar } from '../../scroll-area';
import { Receipt } from '@/constants/Receipt/Receipt';
import { Dispatch, SetStateAction } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setReceiptSelected: Dispatch<SetStateAction<Receipt | undefined>>
  //setUserRowSelected: React.Dispatch<React.SetStateAction<User | null>>
}

export function DataTableReceiptUM<TData, TValue>({
  columns,
  data,
  setReceiptSelected
}: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: -1,
    manualPagination: true,
  });

  /* this can be used to get the selectedrows 
  console.log("value", table.getFilteredSelectedRowModel()); */

  const handleRowClick = (rowId: string) => {
    const isSelected = table.getRow(rowId).getIsSelected();
    table.resetRowSelection(); // Deselecciona todas las filas
    if (!isSelected) {
      table.getRow(rowId).toggleSelected(true); // Selecciona la fila actual
      setReceiptSelected(table.getRow(rowId).original as unknown as Receipt); // Actualiza el estado del usuario seleccionado
    } else {
      //setUserRowSelected(null); // Deselecciona el usuario si la fila ya estaba seleccionada
    }
  };

  return (
    <>
      
      <ScrollArea className="rounded-md border h-[390px]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleRowClick(row.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
     
    </>
  );
}

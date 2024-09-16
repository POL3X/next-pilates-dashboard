'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import * as React from 'react';
import { Dispatch } from 'react';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { ReceiptUmFilter } from './receipt-tab';
import { es } from 'date-fns/locale';

interface Props{
  className?: React.HTMLAttributes<HTMLDivElement>,
  date?: DateRange
  setReceiptFilters:Dispatch<React.SetStateAction<ReceiptUmFilter | undefined>>
}

export function CalendarDateRangePickerReceiptUm({
  className,
  date,
  setReceiptFilters
}: Props) {

  const onSelect = (date: DateRange | undefined)=>{
    setReceiptFilters((prevForm) => ({
      ...prevForm, 
      dateRange: date, 
    }));
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                 {format(date.from, 'LLL dd, y', { locale: es })} -{' '}
                 {format(date.to, 'LLL dd, y', { locale: es })}
                </>
              ) : (
                format(date.from, 'LLL dd, y', { locale: es })
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

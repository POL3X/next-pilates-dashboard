"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Dispatch, SetStateAction } from "react"
import { getPaymentMethodLabel, PaymentMethod, paymentMethodLabels, Receipt } from "@/constants/Receipt/Receipt"

interface Props {
    receiptPaymentMethod: PaymentMethod
    setReceiptPaymentMethod: Dispatch<SetStateAction<PaymentMethod | undefined>>
}


export function ComboboxPaymentMethod({ receiptPaymentMethod, setReceiptPaymentMethod }: Props) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<PaymentMethod | undefined>(receiptPaymentMethod || PaymentMethod.CASH)

    React.useEffect(() => {
        if (!receiptPaymentMethod) {
            setReceiptPaymentMethod(PaymentMethod.CASH)
        }
    }, [])

    const handleSelect = (currentValue: PaymentMethod | null) => {
        if (currentValue == null) {
            setReceiptPaymentMethod(undefined)
            setValue(undefined);
            setOpen(false);
            return
        }
        if (currentValue !== value) {
            setValue(currentValue);
            setReceiptPaymentMethod(currentValue)
        } 
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value ? getPaymentMethodLabel(value) : 'Seleccione Método de Pago'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>         
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No existen Métodos de Pago</CommandEmpty>
                        <CommandGroup>
                            {Object.values(PaymentMethod).map((method) => (
                                <CommandItem
                                    key={method}
                                    value={method}
                                    onSelect={() => handleSelect(method)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === method ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {paymentMethodLabels[method]}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

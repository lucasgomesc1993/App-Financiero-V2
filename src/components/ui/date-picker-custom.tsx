"use client"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DatePickerCustomProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disablePastDates?: boolean
  disableFutureDates?: boolean
  minDate?: Date
  maxDate?: Date
}

export function DatePickerCustom({ 
  value, 
  onChange, 
  placeholder = "Selecione uma data",
  className,
  disablePastDates = false,
  disableFutureDates = false,
  minDate,
  maxDate
}: DatePickerCustomProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yy", { locale: ptBR }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={(date) => {
            // Lógica combinada para desabilitar datas
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            if (disablePastDates) {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              if (date < today) return true
            }
            if (disableFutureDates) {
              const today = new Date()
              today.setHours(23, 59, 59, 999)
              if (date > today) return true
            }
            // Limites padrão caso nenhuma opção seja especificada
            return date < new Date("1900-01-01")
          }}
          initialFocus
          locale={ptBR}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  )
}
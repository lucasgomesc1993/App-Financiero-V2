"use client"

import { TimePeriod } from "@/lib/chart/types"
import { ChartConfigFactory } from "@/lib/chart/config-factory"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PeriodSelectorProps {
  value: TimePeriod
  onChange: (period: TimePeriod) => void
  className?: string
}

/**
 * Componente de seleção de período para gráficos
 */
export function PeriodSelector({ value, onChange, className = "" }: PeriodSelectorProps) {
  const periodOptions = ChartConfigFactory.getAllPeriodConfigs()

  // Agrupar opções por categorias
  const dailyOptions = periodOptions.filter(opt => 
    ['today', 'yesterday', 'last_7_days', 'last_15_days', 'last_30_days'].includes(opt.value)
  )
  
  const weeklyOptions = periodOptions.filter(opt => 
    ['this_week', 'last_week'].includes(opt.value)
  )
  
  const monthlyOptions = periodOptions.filter(opt => 
    ['this_month', 'last_month'].includes(opt.value)
  )
  
  const yearlyOptions = periodOptions.filter(opt => 
    ['last_90_days', 'last_year'].includes(opt.value)
  )

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`flex w-48 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate ${className}`}
        size="sm"
        aria-label="Selecione um período"
      >
        <SelectValue placeholder="Últimos 30 dias" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {/* Opções diárias */}
        {dailyOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="rounded-lg">
            {option.label}
          </SelectItem>
        ))}
        <SelectSeparator />
        
        {/* Opções semanais */}
        {weeklyOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="rounded-lg">
            {option.label}
          </SelectItem>
        ))}
        <SelectSeparator />
        
        {/* Opções mensais */}
        {monthlyOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="rounded-lg">
            {option.label}
          </SelectItem>
        ))}
        <SelectSeparator />
        
        {/* Opções anuais */}
        {yearlyOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="rounded-lg">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
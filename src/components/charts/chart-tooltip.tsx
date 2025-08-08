"use client"

import { DataGrouping } from "@/lib/chart/types"
import { BrazilianDateFormatter, FormatterFactory } from "@/lib/chart/formatters"

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
  grouping?: DataGrouping
}

/**
 * Componente de tooltip personalizado para gráficos
 */
export function ChartTooltipContent({ 
  active, 
  payload, 
  label,
  grouping = 'daily'
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  const formatter = FormatterFactory.createTooltipFormatter()

  // Formatar a label baseado no agrupamento
  let formattedLabel = label
  if (label) {
    try {
      const date = new Date(label)
      if (!isNaN(date.getTime())) {
        formattedLabel = formatter.formatLabel(date, grouping)
      }
    } catch (error) {
      // Se não for uma data válida, usa o label original
      formattedLabel = label
    }
  }

  return (
    <div className="border-border/50 bg-background rounded-lg border px-4 py-3 shadow-xl min-w-[200px]">
      {formattedLabel && (
        <div className="text-sm font-semibold text-foreground mb-3 pb-2 border-b">
          {formattedLabel}
        </div>
      )}
      <div className="space-y-3">
        {payload.map((item, index) => (
          <div key={item.dataKey || index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground font-medium">
                {item.name}
              </span>
            </div>
            <span className="text-sm text-foreground tabular-nums ml-4">
              {formatter.formatValue(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Componente de tooltip simplificado para uso direto
 */
interface SimpleChartTooltipProps {
  content?: React.ComponentType<any>
  cursor?: boolean
  formatter?: (value: any, name: string) => [string, string]
  labelFormatter?: (label: string) => string
}

export function SimpleChartTooltip({ 
  content = ChartTooltipContent,
  cursor = false,
  formatter,
  labelFormatter 
}: SimpleChartTooltipProps) {
  return {
    cursor,
    content,
    formatter,
    labelFormatter
  }
}
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Componente de tooltip personalizado com melhor espaçamento
function CustomChartTooltipContent({ 
  active, 
  payload, 
  label,
  labelFormatter 
}: {
  active?: boolean
  payload?: any[]
  label?: string
  labelFormatter?: (value: string) => string
}) {
  if (!active || !payload?.length) {
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formattedLabel = labelFormatter ? labelFormatter(label || '') : label

  return (
    <div className="border-border/50 bg-background rounded-lg border px-4 py-3 shadow-xl min-w-[200px]">
      {formattedLabel && (
        <div className="text-sm font-semibold text-foreground mb-3 pb-2 border-b">
          {formattedLabel}
        </div>
      )}
      <div className="space-y-3">
        {payload.map((item, index) => (
          <div key={item.dataKey} className="flex items-center justify-between">
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
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const description = "An interactive area chart"

// Gerar dados dinâmicos baseados na data atual
const generateChartData = () => {
  const data = []
  const now = new Date()
  const startDate = new Date(now)
  startDate.setMonth(now.getMonth() - 2) // Começa 2 meses atrás
  
  let currentDate = new Date(startDate)
  
  while (currentDate <= now) {
    // Gerar valores realistas para receitas e despesas
    const baseReceitas = 5000 + Math.random() * 4000 // 5000-9000
    const baseDespesas = 3000 + Math.random() * 3000 // 3000-6000
    
    // Adicionar alguma variação sazonal
    const dayOfWeek = currentDate.getDay()
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1
    const monthMultiplier = 1 + (currentDate.getMonth() % 3) * 0.1
    
    const receitas = Math.round(baseReceitas * weekendMultiplier * monthMultiplier)
    const despesas = Math.round(baseDespesas * weekendMultiplier * monthMultiplier)
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      receitas,
      despesas
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return data
}

const chartData = generateChartData()

const chartConfig = {
  fluxoCaixa: {
    label: "Fluxo de Caixa",
  },
  receitas: {
    label: "Receitas",
    color: "hsl(142, 76%, 36%)", // Green color
  },
  despesas: {
    label: "Despesas",
    color: "hsl(0, 84%, 60%)", // Red color
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("ultimos_30_dias")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("ultimos_7_dias")
    }
  }, [isMobile])

  // Função para filtrar dados baseado no período selecionado
  const getFilteredData = () => {
    const now = new Date() // Data atual do sistema
    let startDate = new Date(now)
    
    switch (timeRange) {
      case "hoje":
        startDate.setHours(0, 0, 0, 0)
        break
      case "ontem":
        startDate.setDate(now.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        const endYesterday = new Date(startDate)
        endYesterday.setHours(23, 59, 59, 999)
        return chartData.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate >= startDate && itemDate <= endYesterday
        })
      case "ultimos_7_dias":
        startDate.setDate(now.getDate() - 7)
        break
      case "ultimos_15_dias":
        startDate.setDate(now.getDate() - 15)
        break
      case "ultimos_30_dias":
        startDate.setDate(now.getDate() - 30)
        break
      case "essa_semana":
        const dayOfWeek = now.getDay()
        startDate.setDate(now.getDate() - dayOfWeek)
        break
      case "semana_passada":
        const lastWeekStart = new Date(now)
        lastWeekStart.setDate(now.getDate() - now.getDay() - 7)
        const lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
        return chartData.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate >= lastWeekStart && itemDate <= lastWeekEnd
        })
      case "este_mes":
        startDate.setDate(1)
        break
      case "mes_passado":
        startDate.setMonth(now.getMonth() - 1)
        startDate.setDate(1)
        const lastMonthEnd = new Date(startDate)
        lastMonthEnd.setMonth(startDate.getMonth() + 1)
        lastMonthEnd.setDate(0)
        return chartData.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate >= startDate && itemDate <= lastMonthEnd
        })
      case "ultimos_90_dias":
        startDate.setDate(now.getDate() - 90)
        break
      case "ultimo_ano":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    return chartData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate
    })
  }

  // Função para agrupar dados por período
  const getGroupedData = (data: any[]) => {
    const shouldGroupByWeek = ["ultimos_30_dias", "essa_semana", "semana_passada", "este_mes", "mes_passado"].includes(timeRange)
    const shouldGroupByMonth = ["ultimos_90_dias", "ultimo_ano"].includes(timeRange)

    if (!shouldGroupByWeek && !shouldGroupByMonth) {
      return data
    }

    const groupedData: { [key: string]: { receitas: number; despesas: number; count: number } } = {}

    data.forEach(item => {
      const itemDate = new Date(item.date)
      let key: string

      if (shouldGroupByMonth) {
        key = itemDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' })
      } else {
        // Agrupar por semana
        const weekStart = new Date(itemDate)
        weekStart.setDate(itemDate.getDate() - itemDate.getDay())
        key = `Semana ${Math.ceil((itemDate.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))}`
      }

      if (!groupedData[key]) {
        groupedData[key] = { receitas: 0, despesas: 0, count: 0 }
      }
      
      groupedData[key].receitas += item.receitas
      groupedData[key].despesas += item.despesas
      groupedData[key].count += 1
    })

    return Object.entries(groupedData).map(([key, values]) => ({
      date: key,
      receitas: Math.round(values.receitas / values.count),
      despesas: Math.round(values.despesas / values.count)
    }))
  }

  const filteredData = getFilteredData()
  const groupedData = getGroupedData(filteredData)
  const displayData = groupedData.length > 0 ? groupedData : filteredData

  // Função para formatar o eixo X
  const formatXAxis = (value: string) => {
    if (["ultimos_90_dias", "ultimo_ano"].includes(timeRange)) {
      return value // Já está formatado como mês
    }
    if (["ultimos_30_dias", "essa_semana", "semana_passada", "este_mes", "mes_passado"].includes(timeRange)) {
      return value // Já está formatado como semana
    }
    const date = new Date(value)
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short"
    })
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Fluxo de Caixa</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Comparativo entre receitas e despesas
          </span>
          <span className="@[540px]/card:hidden">Receitas vs Despesas</span>
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-48 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Selecione um período"
            >
              <SelectValue placeholder="Últimos 30 dias" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="hoje" className="rounded-lg">Hoje</SelectItem>
              <SelectItem value="ontem" className="rounded-lg">Ontem</SelectItem>
              <SelectSeparator />
              <SelectItem value="ultimos_7_dias" className="rounded-lg">Últimos 7 dias</SelectItem>
              <SelectItem value="ultimos_15_dias" className="rounded-lg">Últimos 15 dias</SelectItem>
              <SelectItem value="ultimos_30_dias" className="rounded-lg">Últimos 30 dias</SelectItem>
              <SelectSeparator />
              <SelectItem value="essa_semana" className="rounded-lg">Essa semana</SelectItem>
              <SelectItem value="semana_passada" className="rounded-lg">Semana passada</SelectItem>
              <SelectSeparator />
              <SelectItem value="este_mes" className="rounded-lg">Este mês</SelectItem>
              <SelectItem value="mes_passado" className="rounded-lg">Mês passado</SelectItem>
              <SelectSeparator />
              <SelectItem value="ultimos_90_dias" className="rounded-lg">Últimos 90 dias</SelectItem>
              <SelectItem value="ultimo_ano" className="rounded-lg">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="fillReceitas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-receitas)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-receitas)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDespesas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-despesas)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-despesas)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatXAxis}
            />
            <ChartTooltip
              cursor={false}
              content={
                <CustomChartTooltipContent
                  labelFormatter={(value) => {
                    // Se for um dado agrupado, retorna o valor diretamente
                    if (["ultimos_90_dias", "ultimo_ano"].includes(timeRange) || 
                        ["ultimos_30_dias", "essa_semana", "semana_passada", "este_mes", "mes_passado"].includes(timeRange)) {
                      return value
                    }
                    // Se for data individual, formata
                    return new Date(value).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  }}
                />
              }
            />
            <Area
              dataKey="receitas"
              type="natural"
              fill="url(#fillReceitas)"
              stroke="var(--color-receitas)"
              stackId="a"
            />
            <Area
              dataKey="despesas"
              type="natural"
              fill="url(#fillDespesas)"
              stroke="var(--color-despesas)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

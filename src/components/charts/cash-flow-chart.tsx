"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import { TimePeriod, ChartConfig, ChartDataPoint } from "@/lib/chart/types"
import { ChartConfigFactory } from "@/lib/chart/config-factory"
import { BrazilianDateFormatter, FormatterFactory } from "@/lib/chart/formatters"
import { ChartCard } from "./chart-card"
import { PeriodSelector } from "./period-selector"
import { ChartTooltipContent } from "./chart-tooltip"
import {
  ChartConfig as UIChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

// Configuração das cores do gráfico
const chartColors = {
  fluxoCaixa: {
    label: "Fluxo de Caixa",
  },
  receitas: {
    label: "Receitas",
    color: "hsl(142, 76%, 36%)", // Verde
  },
  despesas: {
    label: "Despesas",
    color: "hsl(0, 84%, 60%)", // Vermelho
  },
} satisfies UIChartConfig

export function CashFlowChart() {
  const isMobile = useIsMobile()
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>("last_30_days")

  // Define período padrão para mobile
  React.useEffect(() => {
    if (isMobile) {
      setSelectedPeriod("last_7_days")
    }
  }, [isMobile])

  // Gera a configuração do gráfico usando memoização para evitar recalculos
  const chartConfig = React.useMemo(
    () => ChartConfigFactory.create(selectedPeriod),
    [selectedPeriod]
  )

  // Cria o formatador do eixo X
  const xAxisFormatter = React.useMemo(
    () => new BrazilianDateFormatter(),
    []
  )

  // Formata os dados para o Recharts
  const formattedData = React.useMemo(
    () => chartConfig.dataPoints.map((point: ChartDataPoint) => ({
      date: point.date.toISOString().split('T')[0], // Formato ISO para o Recharts
      formattedDate: xAxisFormatter.format(point.date, chartConfig.grouping),
      receitas: point.revenue,
      despesas: point.expenses
    })),
    [chartConfig.dataPoints, chartConfig.grouping, xAxisFormatter]
  )

  return (
    <ChartCard
      title="Fluxo de Caixa"
      description="Comparativo entre receitas e despesas"
      action={
        <PeriodSelector
          value={selectedPeriod}
          onChange={setSelectedPeriod}
        />
      }
    >
      <ChartContainer
        config={chartColors}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart data={formattedData}>
          {/* Definições dos gradientes para as áreas */}
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
          
          {/* Grade do gráfico */}
          <CartesianGrid vertical={false} />
          
          {/* Eixo X com formatação inteligente */}
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
          />
          
          {/* Eixo Y */}
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => 
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value)
            }
          />
          
          {/* Tooltip personalizado */}
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent 
                grouping={chartConfig.grouping}
              />
            }
          />
          
          {/* Área de receitas */}
          <Area
            dataKey="receitas"
            type="natural"
            fill="url(#fillReceitas)"
            stroke="var(--color-receitas)"
            stackId="a"
          />
          
          {/* Área de despesas */}
          <Area
            dataKey="despesas"
            type="natural"
            fill="url(#fillDespesas)"
            stroke="var(--color-despesas)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}
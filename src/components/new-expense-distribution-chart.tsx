"use client"
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const expenseData = [
  {
    category: "Transporte",
    value: 780.63,
    percentage: 28.9,
    color: "#3b82f6"
  },
  {
    category: "Educação", 
    value: 508.57,
    percentage: 18.8,
    color: "#f97316"
  },
  {
    category: "Despesas Pessoais",
    value: 411.94,
    percentage: 15.3,
    color: "#eab308"
  },
  {
    category: "Advogado",
    value: 305.00,
    percentage: 11.3,
    color: "#6b7280"
  },
  {
    category: "Alimentação",
    value: 266.53,
    percentage: 9.9,
    color: "#ef4444"
  },
  {
    category: "Licenciamento",
    value: 557.81,
    percentage: 20.7,
    color: "#10b981"
  }
]

const dateFilters = [
  { value: "hoje", label: "Hoje" },
  { value: "ontem", label: "Ontem" },
  { value: "separator", label: "" },
  { value: "ultimos_7_dias", label: "Últimos 7 dias" },
  { value: "ultimos_15_dias", label: "Últimos 15 dias" },
  { value: "ultimos_30_dias", label: "Últimos 30 dias" },
  { value: "separator", label: "" },
  { value: "essa_semana", label: "Essa semana" },
  { value: "semana_passada", label: "Semana passada" },
  { value: "separator", label: "" },
  { value: "este_mes", label: "Este mês" },
  { value: "mes_passado", label: "Mês passado" },
  { value: "separator", label: "" },
  { value: "ultimos_90_dias", label: "Últimos 90 dias" },
  { value: "ultimo_ano", label: "Último ano" }
]

const chartConfig = {
  value: {
    label: "Valor",
  },
}

export function NewExpenseDistributionChart() {
  const [hoveredExpense, setHoveredExpense] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isAnimated, setIsAnimated] = useState(false)
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(false)
  const [timeRange, setTimeRange] = useState("ultimos_30_dias")
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const calculateTooltipPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef) return { x: 0, y: 0 }
    
    const containerRect = containerRef.getBoundingClientRect()
    const tooltipWidth = 200 // Largura estimada do tooltip
    const tooltipHeight = 80 // Altura estimada do tooltip
    
    // Calcular posição relativa ao container (segue o mouse)
    let x = e.clientX - containerRect.left + 10
    let y = e.clientY - containerRect.top - 10
    
    // Ajustar apenas se o tooltip ultrapassar os limites do container
    if (x + tooltipWidth > containerRect.width) {
      x = containerRect.width - tooltipWidth - 5 // Apenas quando necessário
    }
    if (x < 0) {
      x = 5
    }
    
    if (y + tooltipHeight > containerRect.height) {
      y = containerRect.height - tooltipHeight - 5 // Apenas quando necessário
    }
    if (y < 0) {
      y = 5
    }
    
    return { x, y }
  }

  const maxExpense = expenseData.reduce((max, item) => item.value > max.value ? item : max)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Distribuição de Despesas</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Análise detalhada das despesas por categoria
          </span>
          <span className="@[540px]/card:hidden">Despesas por categoria</span>
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
              {dateFilters.map((filter, index) => 
                filter.value === "separator" ? (
                  <SelectSeparator key={`separator-${index}`} />
                ) : (
                  <SelectItem key={filter.value} value={filter.value} className="rounded-lg">
                    {filter.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de distribuição visual */}
        <div className="relative" ref={setContainerRef}>
          <div className="w-full h-8 bg-muted rounded-full overflow-hidden flex">
            {expenseData.map((item, index) => (
              <div
                key={index}
                className="h-full cursor-pointer transition-all duration-1000 ease-out hover:opacity-80"
                style={{
                  backgroundColor: item.color,
                  width: isAnimated ? `${item.percentage}%` : '0%',
                  transitionDelay: `${index * 150}ms`
                }}
                onMouseEnter={(e) => {
                  setHoveredExpense(index)
                  const pos = calculateTooltipPosition(e)
                  setTooltipPosition(pos)
                }}
                onMouseLeave={() => setHoveredExpense(null)}
                onMouseMove={(e) => {
                  const pos = calculateTooltipPosition(e)
                  setTooltipPosition(pos)
                }}
              />
            ))}
          </div>
          <p className="text-foreground text-sm py-0 mt-3">
            Maior: <span className="font-medium">{maxExpense.category}</span> ({maxExpense.percentage}% • R$ {maxExpense.value.toFixed(2).replace('.', ',')})
          </p>
          
          {/* Tooltip para despesas */}
          {hoveredExpense !== null && (
            <div
              className="absolute z-50 bg-background border border-border rounded-lg p-3 shadow-lg pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: expenseData[hoveredExpense].color }}
                />
                <span className="font-medium text-sm">
                  {expenseData[hoveredExpense].category}
                </span>
              </div>
              <div className="text-muted-foreground text-xs">
                <div>Valor: R$ {expenseData[hoveredExpense].value.toFixed(2).replace('.', ',')}</div>
                <div>Percentual: {expenseData[hoveredExpense].percentage}%</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Lista de categorias */}
        <div className="space-y-3">
          {expenseData
            .slice(0, isExpenseExpanded ? expenseData.length : 4)
            .map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between leading-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground text-sm">{item.category}</span>
                </div>
                <div className="text-right flex items-center gap-2 justify-end">
                  <span className="text-sm font-medium">
                    {item.percentage}%
                  </span>
                  <div className="w-1 h-1 bg-muted rounded-full"></div>
                  <span className="text-muted-foreground text-sm">
                    R$ {item.value.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            ))}
          
          {expenseData.length > 4 && (
            <button
              onClick={() => setIsExpenseExpanded(!isExpenseExpanded)}
              className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isExpenseExpanded ? (
                <>
                  <span>Recolher</span>
                  <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Ver mais {expenseData.length - 4} categorias</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
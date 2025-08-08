"use client"
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useState, useEffect, useRef } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const revenueData = [
  {
    category: "Salário",
    value: 4850.00,
    percentage: 39.3,
    color: "#10b981"
  },
  {
    category: "Freelancer", 
    value: 3250.50,
    percentage: 26.3,
    color: "#3b82f6"
  },
  {
    category: "Investimentos",
    value: 2150.75,
    percentage: 17.4,
    color: "#8b5cf6"
  },
  {
    category: "Aluguel",
    value: 1200.00,
    percentage: 9.7,
    color: "#f59e0b"
  },
  {
    category: "Vendas",
    value: 850.25,
    percentage: 6.9,
    color: "#ef4444"
  },
  {
    category: "Outros",
    value: 48.50,
    percentage: 0.4,
    color: "#6b7280"
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

export function NewRevenueDistributionChart() {
  const [hoveredRevenue, setHoveredRevenue] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [displayTooltipPosition, setDisplayTooltipPosition] = useState({ x: 0, y: 0 })
  const [isAnimated, setIsAnimated] = useState(false)
  const [isRevenueExpanded, setIsRevenueExpanded] = useState(false)
  const [timeRange, setTimeRange] = useState("ultimos_30_dias")
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  // Animação suave do tooltip
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const animateTooltip = () => {
      setDisplayTooltipPosition(prev => ({
        x: prev.x + (tooltipPosition.x - prev.x) * 0.3, // Aumentado para 0.3 para resposta mais rápida
        y: prev.y + (tooltipPosition.y - prev.y) * 0.3
      }))
      
      if (
        Math.abs(tooltipPosition.x - displayTooltipPosition.x) > 1 ||
        Math.abs(tooltipPosition.y - displayTooltipPosition.y) > 1
      ) {
        animationRef.current = requestAnimationFrame(animateTooltip)
      }
    }

    if (hoveredRevenue !== null) {
      // Resetar a posição de exibição para a posição atual do mouse quando iniciar
      setDisplayTooltipPosition(tooltipPosition)
      animationRef.current = requestAnimationFrame(animateTooltip)
    } else {
      setDisplayTooltipPosition(tooltipPosition)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [tooltipPosition, hoveredRevenue])

  const calculateTooltipPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef) return { x: 0, y: 0 }
    
    const containerRect = containerRef.getBoundingClientRect()
    
    // Calcular posição relativa ao container (segue o mouse)
    let x = e.clientX - containerRect.left
    let y = e.clientY - containerRect.top
    
    // Posicionar o tooltip centralizado acima do cursor
    x = x - 100 // Centralizar horizontalmente (metade da largura estimada do tooltip)
    y = y - 90 // Posicionar acima do cursor
    
    // Permitir que o tooltip ultrapasse os limites, mas evitar valores extremos
    // que poderiam causar comportamento estranho
    if (x < -200) {
      x = e.clientX - containerRect.left - 100 // Recalcular para seguir o mouse
    }
    if (x > containerRect.width + 100) {
      x = e.clientX - containerRect.left - 100 // Recalcular para seguir o mouse
    }
    
    return { x, y }
  }

  const maxRevenue = revenueData.reduce((max, item) => item.value > max.value ? item : max)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Distribuição de Receitas</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Análise detalhada das receitas por categoria
          </span>
          <span className="@[540px]/card:hidden">Receitas por categoria</span>
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
            {revenueData.map((item, index) => (
              <div
                key={index}
                className="h-full cursor-pointer transition-all duration-1000 ease-out hover:opacity-80"
                style={{
                  backgroundColor: item.color,
                  width: isAnimated ? `${item.percentage}%` : '0%',
                  transitionDelay: `${index * 150}ms`
                }}
                onMouseEnter={(e) => {
                  setHoveredRevenue(index)
                  const pos = calculateTooltipPosition(e)
                  setTooltipPosition(pos)
                }}
                onMouseLeave={() => setHoveredRevenue(null)}
                onMouseMove={(e) => {
                  const pos = calculateTooltipPosition(e)
                  setTooltipPosition(pos)
                }}
              />
            ))}
          </div>
          <p className="text-foreground text-sm py-0 mt-3">
            Maior: <span className="font-medium">{maxRevenue.category}</span> ({maxRevenue.percentage}% • R$ {maxRevenue.value.toFixed(2).replace('.', ',')})
          </p>
          
          {/* Tooltip para receitas */}
          {hoveredRevenue !== null && (
            <div
              className="absolute z-50 bg-background border border-border rounded-lg p-3 shadow-lg pointer-events-none transition-all duration-200"
              style={{
                left: displayTooltipPosition.x,
                top: displayTooltipPosition.y,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: revenueData[hoveredRevenue].color }}
                />
                <span className="font-medium text-sm">
                  {revenueData[hoveredRevenue].category}
                </span>
              </div>
              <div className="text-muted-foreground text-xs">
                <div>Valor: R$ {revenueData[hoveredRevenue].value.toFixed(2).replace('.', ',')}</div>
                <div>Percentual: {revenueData[hoveredRevenue].percentage}%</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Lista de categorias */}
        <div className="space-y-3">
          {revenueData
            .slice(0, isRevenueExpanded ? revenueData.length : 4)
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
          
          {revenueData.length > 4 && (
            <button
              onClick={() => setIsRevenueExpanded(!isRevenueExpanded)}
              className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isRevenueExpanded ? (
                <>
                  <span>Recolher</span>
                  <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Ver mais {revenueData.length - 4} categorias</span>
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
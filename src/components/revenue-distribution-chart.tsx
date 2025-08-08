"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"

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

const chartConfig = {
  value: {
    label: "Valor",
  },
}

export function RevenueDistributionChart() {
  const [hoveredRevenue, setHoveredRevenue] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAnimated, setIsAnimated] = useState(false)
  const [isRevenueExpanded, setIsRevenueExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const maxRevenue = revenueData.reduce((max, item) => item.value > max.value ? item : max)

  return (
    <Card className="@container/card">
      <CardHeader className="pb-0 leading-7">
        <CardTitle className="text-lg font-medium">
          Distribuição de Receitas
        </CardTitle>
        <p className="text-muted-foreground text-sm">Agosto de 2025</p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Barra de distribuição visual */}
        <div className="relative">
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
                  setMousePosition({ x: e.clientX, y: e.clientY })
                }}
                onMouseLeave={() => setHoveredRevenue(null)}
                onMouseMove={(e) => {
                  setMousePosition({ x: e.clientX, y: e.clientY })
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
              className="fixed z-50 bg-background border border-border rounded-lg p-3 shadow-lg pointer-events-none"
              style={{
                left: mousePosition.x + 10,
                top: mousePosition.y - 10,
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
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">
                    {item.percentage}%
                  </span>
                  <span className="text-muted-foreground text-sm">
                    • R$ {item.value.toFixed(2).replace('.', ',')}
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
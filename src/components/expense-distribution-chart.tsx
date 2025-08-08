"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"

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

const chartConfig = {
  value: {
    label: "Valor",
  },
}

export function ExpenseDistributionChart() {
  const [hoveredExpense, setHoveredExpense] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAnimated, setIsAnimated] = useState(false)
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const maxExpense = expenseData.reduce((max, item) => item.value > max.value ? item : max)

  return (
    <Card className="@container/card">
      <CardHeader className="pb-0 leading-7">
        <CardTitle className="text-lg font-medium">
          Distribuição de Despesas
        </CardTitle>
        <p className="text-muted-foreground text-sm">Agosto de 2025</p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Barra de distribuição visual */}
        <div className="relative">
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
                  setMousePosition({ x: e.clientX, y: e.clientY })
                }}
                onMouseLeave={() => setHoveredExpense(null)}
                onMouseMove={(e) => {
                  setMousePosition({ x: e.clientX, y: e.clientY })
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
              className="fixed z-50 bg-background border border-border rounded-lg p-3 shadow-lg pointer-events-none"
              style={{
                left: mousePosition.x + 10,
                top: mousePosition.y - 10,
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
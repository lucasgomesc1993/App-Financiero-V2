"use client"

import { ReactNode } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * Componente de card reutilizável para gráficos
 */
export function ChartCard({ 
  title, 
  description, 
  children, 
  action, 
  className = "" 
}: ChartCardProps) {
  return (
    <Card className={`@container/card ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              {description}
            </span>
            <span className="@[540px]/card:hidden">
              {description.length > 30 ? description.substring(0, 30) + "..." : description}
            </span>
          </CardDescription>
        )}
        {action && (
          <CardAction>
            {action}
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {children}
      </CardContent>
    </Card>
  )
}
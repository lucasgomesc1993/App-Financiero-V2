"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building,
  PiggyBank,
  Target,
  ShoppingCart,
  Utensils,
  Home,
  Car
} from "lucide-react"

interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  savingsRate: number
}

interface CategorySpending {
  category: string
  amount: number
  percentage: number
  color: string
  icon: string
}

interface MonthlyTrend {
  month: string
  income: number
  expenses: number
  balance: number
}

interface AccountSummary {
  name: string
  balance: number
  change: number
  changePercentage: number
  color: string
  icon: string
}

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedYear, setSelectedYear] = useState('2024')

  // Mock data for financial summary
  const financialSummary: FinancialSummary = {
    totalIncome: 8500.00,
    totalExpenses: 6230.50,
    netBalance: 2269.50,
    savingsRate: 26.7
  }

  // Mock data for category spending
  const categorySpending: CategorySpending[] = [
    { category: 'Alimentação', amount: 1850.75, percentage: 29.7, color: '#ef4444', icon: 'Utensils' },
    { category: 'Moradia', amount: 1500.00, percentage: 24.1, color: '#3b82f6', icon: 'Home' },
    { category: 'Transporte', amount: 850.50, percentage: 13.6, color: '#f97316', icon: 'Car' },
    { category: 'Lazer', amount: 680.25, percentage: 10.9, color: '#06b6d4', icon: 'ShoppingCart' },
    { category: 'Saúde', amount: 520.00, percentage: 8.3, color: '#22c55e', icon: 'Target' },
    { category: 'Outros', amount: 829.00, percentage: 13.4, color: '#6b7280', icon: 'ShoppingCart' },
  ]

  // Mock data for monthly trends
  const monthlyTrends: MonthlyTrend[] = [
    { month: 'Jan', income: 8200, expenses: 5800, balance: 2400 },
    { month: 'Fev', income: 8500, expenses: 6100, balance: 2400 },
    { month: 'Mar', income: 8300, expenses: 5900, balance: 2400 },
    { month: 'Abr', income: 8600, expenses: 6200, balance: 2400 },
    { month: 'Mai', income: 8400, expenses: 6000, balance: 2400 },
    { month: 'Jun', income: 8500, expenses: 6230.50, balance: 2269.50 },
  ]

  // Mock data for account summaries
  const accountSummaries: AccountSummary[] = [
    { name: 'Conta Corrente', balance: 5432.50, change: 1200.00, changePercentage: 28.4, color: '#3b82f6', icon: 'Building' },
    { name: 'Poupança', balance: 15000.00, change: 2500.00, changePercentage: 20.0, color: '#22c55e', icon: 'PiggyBank' },
    { name: 'Investimentos', balance: 25000.00, change: 3200.00, changePercentage: 14.7, color: '#8b5cf6', icon: 'Target' },
    { name: 'Cartão de Crédito', balance: -1250.75, change: -450.25, changePercentage: -56.3, color: '#ef4444', icon: 'CreditCard' },
  ]

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const renderIcon = (iconName: string, color: string, size: number = 16) => {
    const iconProps = {
      size,
      style: { color },
      strokeWidth: 2
    }

    switch (iconName) {
      case 'TrendingUp': return <TrendingUp {...iconProps} />
      case 'TrendingDown': return <TrendingDown {...iconProps} />
      case 'DollarSign': return <DollarSign {...iconProps} />
      case 'PieChart': return <PieChart {...iconProps} />
      case 'BarChart3': return <BarChart3 {...iconProps} />
      case 'Calendar': return <Calendar {...iconProps} />
      case 'CreditCard': return <CreditCard {...iconProps} />
      case 'Building': return <Building {...iconProps} />
      case 'PiggyBank': return <PiggyBank {...iconProps} />
      case 'Target': return <Target {...iconProps} />
      case 'ShoppingCart': return <ShoppingCart {...iconProps} />
      case 'Utensils': return <Utensils {...iconProps} />
      case 'Home': return <Home {...iconProps} />
      case 'Car': return <Car {...iconProps} />
      default: return <DollarSign {...iconProps} />
    }
  }

  const renderCategoryCard = (category: CategorySpending) => (
    <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {renderIcon(category.icon, category.color, 20)}
        <div>
          <p className="font-medium">{category.category}</p>
          <p className="text-sm text-muted-foreground">{formatPercentage(category.percentage)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{formatCurrency(category.amount)}</p>
        <Progress value={category.percentage} className="h-2 w-24 mt-1" />
      </div>
    </div>
  )

  const renderAccountCard = (account: AccountSummary) => (
    <div key={account.name} className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {renderIcon(account.icon, account.color, 20)}
        <div>
          <p className="font-medium">{account.name}</p>
          <div className="flex items-center gap-1">
            {account.change >= 0 ? (
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            )}
            <p className={`text-xs ${account.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(Math.abs(account.changePercentage))}
            </p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {account.balance >= 0 ? '' : '-'}{formatCurrency(account.balance)}
        </p>
        <p className={`text-xs ${account.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {account.change >= 0 ? '+' : ''}{formatCurrency(account.change)}
        </p>
      </div>
    </div>
  )

  const renderMonthlyTrendRow = (trend: MonthlyTrend) => (
    <div key={trend.month} className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <p className="font-medium">{trend.month}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-right">
        <div>
          <p className="text-sm text-green-600">{formatCurrency(trend.income)}</p>
          <p className="text-xs text-muted-foreground">Receitas</p>
        </div>
        <div>
          <p className="text-sm text-red-600">{formatCurrency(trend.expenses)}</p>
          <p className="text-xs text-muted-foreground">Despesas</p>
        </div>
        <div>
          <p className={`text-sm font-medium ${trend.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend.balance >= 0 ? '' : '-'}{formatCurrency(trend.balance)}
          </p>
          <p className="text-xs text-muted-foreground">Saldo</p>
        </div>
      </div>
    </div>
  )

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Relatórios Financeiros</h1>
                    <p className="text-muted-foreground">
                      Análise detalhada do seu desempenho financeiro
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Semana</SelectItem>
                        <SelectItem value="month">Mês</SelectItem>
                        <SelectItem value="quarter">Trimestre</SelectItem>
                        <SelectItem value="year">Ano</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-4 @5xl/main:grid-cols-4">
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <TrendingUp className="size-4" />
                        Receitas
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl text-green-600">
                        {formatCurrency(financialSummary.totalIncome)}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp className="size-3" />
                          +12.5%
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Receitas crescentes <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Total de entradas no período
                      </div>
                    </CardFooter>
                  </Card>
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <TrendingDown className="size-4" />
                        Despesas
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl text-red-600">
                        {formatCurrency(financialSummary.totalExpenses)}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingDown className="size-3" />
                          +8.3%
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Despesas controladas <TrendingDown className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Total de saídas no período
                      </div>
                    </CardFooter>
                  </Card>
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <DollarSign className="size-4" />
                        Saldo Líquido
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl text-blue-600">
                        {formatCurrency(financialSummary.netBalance)}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp className="size-3" />
                          +28.7%
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Saldo positivo <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Resultado líquido do período
                      </div>
                    </CardFooter>
                  </Card>
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <PiggyBank className="size-4" />
                        Taxa de Poupança
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl text-purple-600">
                        {formatPercentage(financialSummary.savingsRate)}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp className="size-3" />
                          +3.2%
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Economia em alta <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Percentual de renda economizada
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="categories">Categorias</TabsTrigger>
                    <TabsTrigger value="trends">Tendências</TabsTrigger>
                    <TabsTrigger value="accounts">Contas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Distribuição de Gastos</CardTitle>
                          <CardDescription>
                            Despesas por categoria no período selecionado
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {categorySpending.slice(0, 5).map(renderCategoryCard)}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Desempenho das Contas</CardTitle>
                          <CardDescription>
                            Evolução do saldo das suas contas
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {accountSummaries.slice(0, 4).map(renderAccountCard)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumo Mensal</CardTitle>
                        <CardDescription>
                          Comparação de receitas e despesas nos últimos meses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {monthlyTrends.slice(-4).map(renderMonthlyTrendRow)}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="categories" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Análise por Categorias</CardTitle>
                        <CardDescription>
                          Detalhamento completo dos gastos por categoria
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {categorySpending.map(renderCategoryCard)}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total de Despesas</span>
                            <span className="font-bold text-red-600">{formatCurrency(financialSummary.totalExpenses)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="trends" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tendências Mensais</CardTitle>
                        <CardDescription>
                          Evolução das receitas e despesas ao longo do tempo
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {monthlyTrends.map(renderMonthlyTrendRow)}
                        </div>
                        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Média Receitas</p>
                            <p className="font-bold text-green-600">
                              {formatCurrency(monthlyTrends.reduce((sum, t) => sum + t.income, 0) / monthlyTrends.length)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Média Despesas</p>
                            <p className="font-bold text-red-600">
                              {formatCurrency(monthlyTrends.reduce((sum, t) => sum + t.expenses, 0) / monthlyTrends.length)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Média Saldo</p>
                            <p className="font-bold text-blue-600">
                              {formatCurrency(monthlyTrends.reduce((sum, t) => sum + t.balance, 0) / monthlyTrends.length)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="accounts" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Análise das Contas</CardTitle>
                        <CardDescription>
                            Desempenho detalhado de cada conta
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {accountSummaries.map(renderAccountCard)}
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Patrimônio Total</span>
                              <span className="font-bold text-green-600">
                                {formatCurrency(accountSummaries.reduce((sum, acc) => sum + acc.balance, 0))}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }
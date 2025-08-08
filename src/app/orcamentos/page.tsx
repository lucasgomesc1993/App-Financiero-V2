"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { Plus, Edit, Trash2, MoreHorizontal, CircleAlert, TrendingDown, TrendingUp, AlertTriangle, Target, Calendar, DollarSign } from "lucide-react"
import { useCurrencyFormat } from "@/hooks/use-currency-format"

interface Budget {
  id: string
  name: string
  category: string
  amount: number
  period: 'mensal' | 'anual'
  color: string
  icon: string
}

export default function OrcamentosPage() {
  const [budgets, setBudgets] = useState<Budget[]>([
    { 
      id: '1', 
      name: 'Alimentação', 
      category: 'Alimentação', 
      amount: 1200, 
      period: 'mensal', 
      color: '#ef4444', 
      icon: 'TrendingDown' 
    },
    { 
      id: '2', 
      name: 'Transporte', 
      category: 'Transporte', 
      amount: 500, 
      period: 'mensal', 
      color: '#f97316', 
      icon: 'TrendingDown' 
    },
    { 
      id: '3', 
      name: 'Lazer', 
      category: 'Lazer', 
      amount: 300, 
      period: 'mensal', 
      color: '#06b6d4', 
      icon: 'TrendingDown' 
    },
    { 
      id: '4', 
      name: 'Investimentos', 
      category: 'Investimentos', 
      amount: 10000, 
      period: 'anual', 
      color: '#22c55e', 
      icon: 'TrendingUp' 
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: 0,
    period: 'mensal' as 'mensal' | 'anual',
    color: '#ef4444',
    icon: 'TrendingDown'
  })

  const amountFormat = useCurrencyFormat(formData.amount.toString())

  const colorOptions = [
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Amarelo', value: '#eab308' },
    { name: 'Verde', value: '#22c55e' },
    { name: 'Ciano', value: '#06b6d4' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Cinza', value: '#6b7280' },
  ]

  const iconOptions = [
    { name: 'Tendência Baixa', value: 'TrendingDown' },
    { name: 'Tendência Alta', value: 'TrendingUp' },
    { name: 'Alvo', value: 'Target' },
    { name: 'Calendário', value: 'Calendar' },
    { name: 'Dólar', value: 'DollarSign' },
    { name: 'Alerta', value: 'AlertTriangle' },
  ]

  const categoryOptions = [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 
    'Vestuário', 'Utilidades', 'Investimentos', 'Outros'
  ]

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("O nome do orçamento é obrigatório")
      return
    }

    if (!formData.category.trim()) {
      toast.error("A categoria é obrigatória")
      return
    }

    const amountValue = amountFormat.numericValue

    if (amountValue <= 0) {
      toast.error("O valor do orçamento deve ser maior que zero")
      return
    }

    if (editingBudget) {
      // Update existing budget
      setBudgets(budgets.map(budget => 
        budget.id === editingBudget.id 
          ? { ...budget, ...formData, amount: amountValue }
          : budget
      ))
      toast.success("Orçamento atualizado com sucesso!")
    } else {
      // Add new budget
      const newBudget: Budget = {
        id: Date.now().toString(),
        ...formData,
        amount: amountValue
      }
      setBudgets([...budgets, newBudget])
      toast.success("Orçamento criado com sucesso!")
    }

    resetForm()
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData({
      name: budget.name,
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      color: budget.color,
      icon: budget.icon
    })
    amountFormat.setValue(budget.amount.toString())
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id))
    toast.success("Orçamento excluído com sucesso!")
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      amount: 0,
      period: 'mensal',
      color: '#ef4444',
      icon: 'TrendingDown'
    })
    amountFormat.setValue('')
    setEditingBudget(null)
    setIsDialogOpen(false)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  

  const renderIcon = (iconName: string, color: string, size: number = 16) => {
    const iconProps = {
      size,
      style: { color },
      strokeWidth: 2
    }

    switch (iconName) {
      case 'TrendingDown': return <TrendingDown {...iconProps} />
      case 'TrendingUp': return <TrendingUp {...iconProps} />
      case 'Target': return <Target {...iconProps} />
      case 'Calendar': return <Calendar {...iconProps} />
      case 'DollarSign': return <DollarSign {...iconProps} />
      case 'AlertTriangle': return <AlertTriangle {...iconProps} />
      default: return <TrendingDown {...iconProps} />
    }
  }

  const renderBudgetCard = (budget: Budget) => {
    return (
      <div
        key={budget.id}
        className="flex items-center justify-between p-4 border rounded-lg"
      >
        <div className="flex items-center gap-3">
          {renderIcon(budget.icon, budget.color, 20)}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{budget.name}</p>
              <Badge variant="secondary" className="text-xs">
                {budget.period === 'mensal' ? 'Mensal' : 'Anual'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{budget.category}</p>
            <div className="mt-2">
              <span className="text-sm font-medium">
                Orçamento: {formatCurrency(budget.amount)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <BudgetActionsDropdown 
            budget={budget}
            onEdit={() => handleEdit(budget)}
            onDelete={() => handleDelete(budget.id)}
          />
        </div>
      </div>
    )
  }

  // Component for delete confirmation dialog
  function DeleteBudgetDialog({ 
    budget, 
    onDelete 
  }: { 
    budget: Budget
    onDelete: () => void 
  }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <CircleAlert className="opacity-80" size={16} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o orçamento "{budget.name}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  // Component for color picker
  function ColorPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <div 
              className="w-4 h-4 rounded-full border" 
              style={{ backgroundColor: value }}
            />
            {colorOptions.find(color => color.value === value)?.name || 'Personalizado'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-300 transition-colors"
                style={{ backgroundColor: color.value }}
                onClick={() => onChange(color.value)}
                title={color.name}
              />
            ))}
          </div>
          <div className="mt-3">
            <Label htmlFor="custom-color" className="text-xs text-muted-foreground">
              Cor personalizada
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="custom-color"
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // Component for actions dropdown
  function BudgetActionsDropdown({ 
    budget, 
    onEdit, 
    onDelete 
  }: { 
    budget: Budget
    onEdit: () => void
    onDelete: () => void 
  }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DeleteBudgetDialog 
            budget={budget}
            onDelete={onDelete}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Filter budgets by period
  const monthlyBudgets = budgets.filter(b => b.period === 'mensal')
  const annualBudgets = budgets.filter(b => b.period === 'anual')

  // Calculate totals
  const totalMonthlyBudget = monthlyBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalAnnualBudget = annualBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalBudgets = budgets.length

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
                    <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
                    <p className="text-muted-foreground">
                      Planeje e acompanhe seus gastos por categoria
                    </p>
                  </div>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Orçamento
                  </Button>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-3">
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <TrendingDown className="size-4" />
                        Orçamento Mensal
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
                        {formatCurrency(totalMonthlyBudget)}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp className="size-3" />
                          +8.5%
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Planejamento mensal <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        {monthlyBudgets.length} orçamentos ativos
                      </div>
                    </CardFooter>
                  </Card>
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <Target className="size-4" />
                        Orçamento Anual
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
                        {formatCurrency(totalAnnualBudget)}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp className="size-3" />
                          +12.3%
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Planejamento anual <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        {annualBudgets.length} orçamentos ativos
                      </div>
                    </CardFooter>
                  </Card>
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <DollarSign className="size-4" />
                        Total de Orçamentos
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
                        {totalBudgets}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <TrendingUp className="size-3" />
                          +2
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Orçamentos ativos <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Total de orçamentos cadastrados
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Orçamentos</CardTitle>
                    <CardDescription>
                      Acompanhe seus orçamentos e controle os gastos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="mensal" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="mensal">Mensais</TabsTrigger>
                        <TabsTrigger value="anual">Anuais</TabsTrigger>
                      </TabsList>
                      <TabsContent value="mensal" className="space-y-4">
                        {monthlyBudgets.length > 0 ? (
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {monthlyBudgets.map(renderBudgetCard)}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>Nenhum orçamento mensal cadastrado</p>
                            <p className="text-sm">Clique em "Novo Orçamento" para adicionar seu primeiro orçamento</p>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="anual" className="space-y-4">
                        {annualBudgets.length > 0 ? (
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {annualBudgets.map(renderBudgetCard)}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>Nenhum orçamento anual cadastrado</p>
                            <p className="text-sm">Clique em "Novo Orçamento" para adicionar seu primeiro orçamento</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
              </DialogTitle>
              <DialogDescription>
                {editingBudget 
                  ? 'Atualize as informações do orçamento abaixo.'
                  : 'Preencha as informações para criar um novo orçamento.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor="name">Nome do Orçamento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Alimentação"
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="amount">Valor de Orçamento</Label>
                <Input
                  id="amount"
                  value={amountFormat.formattedValue}
                  onChange={amountFormat.handleChange}
                  placeholder="R$ 0,00"
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="period">Período</Label>
                <Select value={formData.period} onValueChange={(value: any) => setFormData({...formData, period: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="color">Cor</Label>
                <ColorPicker 
                  value={formData.color} 
                  onChange={(value) => setFormData({...formData, color: value})} 
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="icon">Ícone</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center gap-2">
                          {renderIcon(icon.value, formData.color, 16)}
                          {icon.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {editingBudget ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { toast } from "sonner"
import { Plus, Edit, Trash2, MoreHorizontal, CircleAlert, Target, Home, Car, GraduationCap, Plane, PiggyBank, Award, Calendar, DollarSign, TrendingUp, CheckCircle, Clock } from "lucide-react"

interface Goal {
  id: string
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
  status: 'ativa' | 'concluida' | 'pausada'
  color: string
  icon: string
}

export default function MetasPage() {
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: '1', 
      name: 'Casa Própria', 
      description: 'Entrada para apartamento', 
      targetAmount: 50000, 
      currentAmount: 25000, 
      targetDate: '2025-12-31', 
      category: 'imovel', 
      status: 'ativa', 
      color: '#3b82f6', 
      icon: 'Home' 
    },
    { 
      id: '2', 
      name: 'Carro Novo', 
      description: 'Troca de carro', 
      targetAmount: 80000, 
      currentAmount: 15000, 
      targetDate: '2026-06-30', 
      category: 'veiculo', 
      status: 'ativa', 
      color: '#ef4444', 
      icon: 'Car' 
    },
    { 
      id: '3', 
      name: 'Pós-graduação', 
      description: 'Curso de especialização', 
      targetAmount: 15000, 
      currentAmount: 15000, 
      targetDate: '2024-12-31', 
      category: 'educacao', 
      status: 'concluida', 
      color: '#22c55e', 
      icon: 'GraduationCap' 
    },
    { 
      id: '4', 
      name: 'Viagem Europa', 
      description: 'Férias em família', 
      targetAmount: 25000, 
      currentAmount: 8000, 
      targetDate: '2025-07-15', 
      category: 'lazer', 
      status: 'ativa', 
      color: '#8b5cf6', 
      icon: 'Plane' 
    },
    { 
      id: '5', 
      name: 'Fundo de Emergência', 
      description: 'Reserva financeira', 
      targetAmount: 20000, 
      currentAmount: 18000, 
      targetDate: '2024-12-31', 
      category: 'reserva', 
      status: 'ativa', 
      color: '#06b6d4', 
      icon: 'PiggyBank' 
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    category: 'reserva',
    status: 'ativa' as 'ativa' | 'concluida' | 'pausada',
    color: '#3b82f6',
    icon: 'Target'
  })

  const colorOptions = [
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Verde', value: '#22c55e' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Ciano', value: '#06b6d4' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Amarelo', value: '#eab308' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Cinza', value: '#6b7280' },
  ]

  const iconOptions = [
    { name: 'Alvo', value: 'Target' },
    { name: 'Casa', value: 'Home' },
    { name: 'Carro', value: 'Car' },
    { name: 'Graduação', value: 'GraduationCap' },
    { name: 'Avião', value: 'Plane' },
    { name: 'Porco', value: 'PiggyBank' },
    { name: 'Prêmio', value: 'Award' },
    { name: 'Calendário', value: 'Calendar' },
    { name: 'Dólar', value: 'DollarSign' },
    { name: 'Tendência Alta', value: 'TrendingUp' },
  ]

  const categoryOptions = [
    { value: 'reserva', label: 'Reserva Financeira' },
    { value: 'imovel', label: 'Imóvel' },
    { value: 'veiculo', label: 'Veículo' },
    { value: 'educacao', label: 'Educação' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'investimento', label: 'Investimento' },
    { value: 'outros', label: 'Outros' },
  ]

  const statusOptions = [
    { value: 'ativa', label: 'Ativa', color: 'bg-green-500' },
    { value: 'concluida', label: 'Concluída', color: 'bg-blue-500' },
    { value: 'pausada', label: 'Pausada', color: 'bg-yellow-500' },
  ]

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("O nome da meta é obrigatório")
      return
    }

    if (formData.targetAmount <= 0) {
      toast.error("O valor alvo deve ser maior que zero")
      return
    }

    if (!formData.targetDate) {
      toast.error("A data alvo é obrigatória")
      return
    }

    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id 
          ? { ...goal, ...formData }
          : goal
      ))
      toast.success("Meta atualizada com sucesso!")
    } else {
      // Add new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        ...formData
      }
      setGoals([...goals, newGoal])
      toast.success("Meta criada com sucesso!")
    }

    resetForm()
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      description: goal.description,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
      category: goal.category,
      status: goal.status,
      color: goal.color,
      icon: goal.icon
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
    toast.success("Meta excluída com sucesso!")
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      category: 'reserva',
      status: 'ativa',
      color: '#3b82f6',
      icon: 'Target'
    })
    setEditingGoal(null)
    setIsDialogOpen(false)
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const getProgressPercentage = (goal: Goal) => {
    return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 50) return 'bg-cyan-500'
    return 'bg-gray-400'
  }

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const renderIcon = (iconName: string, color: string, size: number = 16) => {
    const iconProps = {
      size,
      style: { color },
      strokeWidth: 2
    }

    switch (iconName) {
      case 'Target': return <Target {...iconProps} />
      case 'Home': return <Home {...iconProps} />
      case 'Car': return <Car {...iconProps} />
      case 'GraduationCap': return <GraduationCap {...iconProps} />
      case 'Plane': return <Plane {...iconProps} />
      case 'PiggyBank': return <PiggyBank {...iconProps} />
      case 'Award': return <Award {...iconProps} />
      case 'Calendar': return <Calendar {...iconProps} />
      case 'DollarSign': return <DollarSign {...iconProps} />
      case 'TrendingUp': return <TrendingUp {...iconProps} />
      default: return <Target {...iconProps} />
    }
  }

  const renderGoalCard = (goal: Goal) => {
    const progressPercentage = getProgressPercentage(goal)
    const remaining = goal.targetAmount - goal.currentAmount
    const daysRemaining = getDaysRemaining(goal.targetDate)
    const statusInfo = statusOptions.find(s => s.value === goal.status)
    
    return (
      <div
        key={goal.id}
        className="flex items-center justify-between p-4 border rounded-lg"
      >
        <div className="flex items-center gap-3">
          {goal.status === 'concluida' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            renderIcon(goal.icon, goal.color, 20)
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{goal.name}</p>
              <Badge variant="secondary" className="text-xs">
                {categoryOptions.find(c => c.value === goal.category)?.label}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${statusInfo?.color} text-white border-none`}
              >
                {statusInfo?.label}
              </Badge>
            </div>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
            )}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">
                  {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                </span>
                <span className="text-xs font-medium text-blue-600">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Faltam: {formatCurrency(Math.max(0, remaining))}</span>
              {goal.status === 'ativa' && daysRemaining > 0 && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {daysRemaining} dias
                </div>
              )}
              {goal.status === 'ativa' && daysRemaining <= 0 && (
                <span className="text-red-600 font-medium">Data expirada</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <GoalActionsDropdown 
            goal={goal}
            onEdit={() => handleEdit(goal)}
            onDelete={() => handleDelete(goal.id)}
          />
        </div>
      </div>
    )
  }

  // Component for delete confirmation dialog
  function DeleteGoalDialog({ 
    goal, 
    onDelete 
  }: { 
    goal: Goal
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
                Tem certeza que deseja excluir a meta "{goal.name}"? Esta ação não pode ser desfeita.
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
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a cor" />
        </SelectTrigger>
        <SelectContent>
          {colorOptions.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: color.value }}
                />
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  // Component for actions dropdown
  function GoalActionsDropdown({ 
    goal, 
    onEdit, 
    onDelete 
  }: { 
    goal: Goal
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
          <DeleteGoalDialog 
            goal={goal}
            onDelete={onDelete}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Filter goals by status
  const activeGoals = goals.filter(g => g.status === 'ativa')
  const completedGoals = goals.filter(g => g.status === 'concluida')
  const pausedGoals = goals.filter(g => g.status === 'pausada')

  // Calculate totals
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

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
                    <h1 className="text-2xl font-bold tracking-tight">Metas Financeiras</h1>
                    <p className="text-muted-foreground">
                      Defina e acompanhe seus objetivos financeiros
                    </p>
                  </div>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Meta
                  </Button>
                </div>
              </div>

              <div className="px-4 lg:px-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total de Metas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{goals.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeGoals.length} ativas, {completedGoals.length} concluídas
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Valor Total Alvo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalTargetAmount)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Valor Acumulado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCurrentAmount)}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Progresso</span>
                      <span className="text-xs font-medium text-blue-600">
                        {totalProgress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.min(totalProgress, 100)} className="h-2 mt-1" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Restante</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(Math.max(0, totalTargetAmount - totalCurrentAmount))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Minhas Metas</CardTitle>
                    <CardDescription>
                      Acompanhe o progresso das suas metas financeiras
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="ativas" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="ativas">Ativas ({activeGoals.length})</TabsTrigger>
                        <TabsTrigger value="concluidas">Concluídas ({completedGoals.length})</TabsTrigger>
                        <TabsTrigger value="pausadas">Pausadas ({pausedGoals.length})</TabsTrigger>
                      </TabsList>
                      <TabsContent value="ativas" className="space-y-4">
                        {activeGoals.length > 0 ? (
                          activeGoals.map(renderGoalCard)
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>Nenhuma meta ativa</p>
                            <p className="text-sm">Clique em "Nova Meta" para adicionar sua primeira meta</p>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="concluidas" className="space-y-4">
                        {completedGoals.length > 0 ? (
                          completedGoals.map(renderGoalCard)
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>Nenhuma meta concluída ainda</p>
                            <p className="text-sm">Continue trabalhando para alcançar seus objetivos</p>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="pausadas" className="space-y-4">
                        {pausedGoals.length > 0 ? (
                          pausedGoals.map(renderGoalCard)
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>Nenhuma meta pausada</p>
                            <p className="text-sm">Todas as suas metas estão em andamento</p>
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
                {editingGoal ? 'Editar Meta' : 'Nova Meta'}
              </DialogTitle>
              <DialogDescription>
                {editingGoal 
                  ? 'Atualize as informações da meta abaixo.'
                  : 'Preencha as informações para criar uma nova meta financeira.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor="name">Nome da Meta</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Casa Própria"
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Entrada para apartamento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="targetAmount">Valor Alvo</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({...formData, targetAmount: parseFloat(e.target.value) || 0})}
                    placeholder="50000"
                  />
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="currentAmount">Valor Atual</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({...formData, currentAmount: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="targetDate">Data Alvo</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                {editingGoal ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
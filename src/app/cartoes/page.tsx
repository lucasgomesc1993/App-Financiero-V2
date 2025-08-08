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
import { Plus, Edit, Trash2, MoreHorizontal, CircleAlert, CreditCard, Wallet, Building, Landmark, Shield, Calendar, Percent } from "lucide-react"

interface CreditCard {
  id: string
  name: string
  bank: string
  lastFourDigits: string
  limit: number
  currentBalance: number
  dueDate: number
  closingDate: number
  annualFee: number
  color: string
  icon: string
}

export default function CartoesPage() {
  const [cards, setCards] = useState<CreditCard[]>([
    { 
      id: '1', 
      name: 'Cartão Principal', 
      bank: 'Banco do Brasil', 
      lastFourDigits: '1234', 
      limit: 5000, 
      currentBalance: 1250.75, 
      dueDate: 15, 
      closingDate: 5, 
      annualFee: 0, 
      color: '#ef4444', 
      icon: 'CreditCard' 
    },
    { 
      id: '2', 
      name: 'Cartão Nubank', 
      bank: 'Nubank', 
      lastFourDigits: '5678', 
      limit: 3000, 
      currentBalance: 850.00, 
      dueDate: 8, 
      closingDate: 28, 
      annualFee: 0, 
      color: '#8b5cf6', 
      icon: 'CreditCard' 
    },
    { 
      id: '3', 
      name: 'Cartão Itaú', 
      bank: 'Itaú', 
      lastFourDigits: '9012', 
      limit: 8000, 
      currentBalance: 3200.50, 
      dueDate: 10, 
      closingDate: 25, 
      annualFee: 240, 
      color: '#3b82f6', 
      icon: 'CreditCard' 
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    lastFourDigits: '',
    limit: 0,
    currentBalance: 0,
    dueDate: 1,
    closingDate: 1,
    annualFee: 0,
    color: '#ef4444',
    icon: 'CreditCard'
  })

  const colorOptions = [
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Verde', value: '#22c55e' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Amarelo', value: '#eab308' },
    { name: 'Ciano', value: '#06b6d4' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Cinza', value: '#6b7280' },
  ]

  const iconOptions = [
    { name: 'Cartão', value: 'CreditCard' },
    { name: 'Carteira', value: 'Wallet' },
    { name: 'Prédio', value: 'Building' },
    { name: 'Banco', value: 'Landmark' },
    { name: 'Escudo', value: 'Shield' },
  ]

  const bankOptions = [
    'Banco do Brasil', 'Itaú', 'Bradesco', 'Caixa', 'Nubank', 'Inter', 'Santander', 'PicPay', 'Neon'
  ]

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("O nome do cartão é obrigatório")
      return
    }

    if (!formData.bank.trim()) {
      toast.error("O banco é obrigatório")
      return
    }

    if (!formData.lastFourDigits.trim() || formData.lastFourDigits.length !== 4) {
      toast.error("Os últimos 4 dígitos são obrigatórios")
      return
    }

    if (editingCard) {
      // Update existing card
      setCards(cards.map(card => 
        card.id === editingCard.id 
          ? { ...card, ...formData }
          : card
      ))
      toast.success("Cartão atualizado com sucesso!")
    } else {
      // Add new card
      const newCard: CreditCard = {
        id: Date.now().toString(),
        ...formData
      }
      setCards([...cards, newCard])
      toast.success("Cartão criado com sucesso!")
    }

    resetForm()
  }

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card)
    setFormData({
      name: card.name,
      bank: card.bank,
      lastFourDigits: card.lastFourDigits,
      limit: card.limit,
      currentBalance: card.currentBalance,
      dueDate: card.dueDate,
      closingDate: card.closingDate,
      annualFee: card.annualFee,
      color: card.color,
      icon: card.icon
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id))
    toast.success("Cartão excluído com sucesso!")
  }

  const resetForm = () => {
    setFormData({
      name: '',
      bank: '',
      lastFourDigits: '',
      limit: 0,
      currentBalance: 0,
      dueDate: 1,
      closingDate: 1,
      annualFee: 0,
      color: '#ef4444',
      icon: 'CreditCard'
    })
    setEditingCard(null)
    setIsDialogOpen(false)
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`
  }

  const getUsagePercentage = (card: CreditCard) => {
    return (card.currentBalance / card.limit) * 100
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const renderIcon = (iconName: string, color: string, size: number = 16) => {
    const iconProps = {
      size,
      style: { color },
      strokeWidth: 2
    }

    switch (iconName) {
      case 'CreditCard': return <CreditCard {...iconProps} />
      case 'Wallet': return <Wallet {...iconProps} />
      case 'Building': return <Building {...iconProps} />
      case 'Landmark': return <Landmark {...iconProps} />
      case 'Shield': return <Shield {...iconProps} />
      default: return <CreditCard {...iconProps} />
    }
  }

  const renderCardCard = (card: CreditCard) => {
    const usagePercentage = getUsagePercentage(card)
    
    return (
      <div
        key={card.id}
        className="flex items-center justify-between p-4 border rounded-lg"
      >
        <div className="flex items-center gap-3">
          {renderIcon(card.icon, card.color, 20)}
          <div>
            <p className="font-medium">{card.name}</p>
            <p className="text-sm text-muted-foreground">{card.bank} • •••• {card.lastFourDigits}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">
                <span className="font-medium">Usado:</span> {formatCurrency(card.currentBalance)}
              </span>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm">
                <span className="font-medium">Limite:</span> {formatCurrency(card.limit)}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Utilização</span>
                <span className={`text-xs font-medium ${getUsageColor(usagePercentage)}`}>
                  {usagePercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                Vencimento: {card.dueDate}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                Fechamento: {card.closingDate}
              </div>
              {card.annualFee > 0 && (
                <div className="flex items-center gap-1">
                  <Percent size={12} />
                  Anuidade: {formatCurrency(card.annualFee)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <CardActionsDropdown 
            card={card}
            onEdit={() => handleEdit(card)}
            onDelete={() => handleDelete(card.id)}
          />
        </div>
      </div>
    )
  }

  // Component for delete confirmation dialog
  function DeleteCardDialog({ 
    card, 
    onDelete 
  }: { 
    card: CreditCard
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
                Tem certeza que deseja excluir o cartão "{card.name}"? Esta ação não pode ser desfeita.
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
  function CardActionsDropdown({ 
    card, 
    onEdit, 
    onDelete 
  }: { 
    card: CreditCard
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
          <DeleteCardDialog 
            card={card}
            onDelete={onDelete}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Calculate totals
  const totalLimit = cards.reduce((sum, card) => sum + card.limit, 0)
  const totalUsed = cards.reduce((sum, card) => sum + card.currentBalance, 0)
  const totalAvailable = totalLimit - totalUsed
  const averageUsage = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0

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
                    <h1 className="text-2xl font-bold tracking-tight">Cartões de Crédito</h1>
                    <p className="text-muted-foreground">
                      Gerencie seus cartões de crédito e acompanhe os limites
                    </p>
                  </div>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cartão
                  </Button>
                </div>
              </div>

              <div className="px-4 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Limite Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalLimit)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Utilizado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(totalUsed)}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Utilização</span>
                      <span className={`text-xs font-medium ${getUsageColor(averageUsage)}`}>
                        {averageUsage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={averageUsage} className="h-2 mt-1" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Disponível</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAvailable)}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Cartões</CardTitle>
                    <CardDescription>
                      Gerencie seus cartões de crédito e acompanhe os gastos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {cards.map(renderCardCard)}
                    </div>
                    {cards.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground col-span-full">
                        <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Nenhum cartão cadastrado</p>
                        <p className="text-sm">Clique em "Novo Cartão" para adicionar seu primeiro cartão</p>
                      </div>
                    )}
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
                {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
              </DialogTitle>
              <DialogDescription>
                {editingCard 
                  ? 'Atualize as informações do cartão abaixo.'
                  : 'Preencha as informações para adicionar um novo cartão.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor="name">Nome do Cartão</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Cartão Principal"
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="bank">Banco</Label>
                <Select value={formData.bank} onValueChange={(value) => setFormData({...formData, bank: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankOptions.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="lastFourDigits">Últimos 4 dígitos</Label>
                <Input
                  id="lastFourDigits"
                  value={formData.lastFourDigits}
                  onChange={(e) => setFormData({...formData, lastFourDigits: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="limit">Limite</Label>
                  <Input
                    id="limit"
                    type="number"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: parseFloat(e.target.value) || 0})}
                    placeholder="5000"
                  />
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="currentBalance">Saldo Atual</Label>
                  <Input
                    id="currentBalance"
                    type="number"
                    step="0.01"
                    value={formData.currentBalance}
                    onChange={(e) => setFormData({...formData, currentBalance: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="dueDate">Dia de Vencimento</Label>
                  <Select value={formData.dueDate.toString()} onValueChange={(value) => setFormData({...formData, dueDate: parseInt(value)})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="closingDate">Dia de Fechamento</Label>
                  <Select value={formData.closingDate.toString()} onValueChange={(value) => setFormData({...formData, closingDate: parseInt(value)})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="annualFee">Anuidade (R$)</Label>
                <Input
                  id="annualFee"
                  type="number"
                  step="0.01"
                  value={formData.annualFee}
                  onChange={(e) => setFormData({...formData, annualFee: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
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
                {editingCard ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
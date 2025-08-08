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
import { Plus, Edit, Trash2, MoreHorizontal, CircleAlert, CreditCard, Wallet, Building, Landmark, Shield, Calendar, Percent, TrendingUp, TrendingDown, Star } from "lucide-react"
import { useCurrencyFormat } from "@/hooks/use-currency-format"
import { cn } from "@/lib/utils"

type CreditCardSummaryProps = {
  brand: string
  bank: string
  available: number
  total: number
  closingDate: string | Date
  dueDate: string | Date
  favorite?: boolean
  className?: string
  usedAmount?: number
  onFavoriteClick?: () => void
}

function formatCurrencyBRL(value: number) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch (err) {
    return "R$ " + Number(value || 0).toFixed(2)
  }
}

const PT_BR_MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const

function formatShortDayMonth(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input
  const day = d.getDate()
  const month = PT_BR_MONTHS_SHORT[d.getMonth()]
  return `${day} ${month}`
}

export function CreditCardSummary(props: Partial<CreditCardSummaryProps>) {
  const {
    brand = "Visa Platinum",
    bank = "Itaú",
    available = 64550,
    total = 64550,
    closingDate = new Date(),
    dueDate = new Date(),
    favorite = false,
    className,
    usedAmount,
    onFavoriteClick,
  } = props
  const availableToShow =
    typeof usedAmount === "number"
      ? Math.max(0, total - usedAmount)
      : available
  const usedPercent =
    total > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((typeof usedAmount === "number" ? usedAmount : total - available) / total) * 100
          )
        )
      : 0
  const barColorClass =
    usedPercent < 33
      ? "[&>div]:bg-gradient-to-r [&>div]:from-zinc-300 [&>div]:to-zinc-500 dark:[&>div]:from-zinc-100 dark:[&>div]:to-zinc-300"
      : usedPercent < 66
      ? "[&>div]:bg-gradient-to-r [&>div]:from-zinc-400 [&>div]:to-zinc-600 dark:[&>div]:from-zinc-200 dark:[&>div]:to-zinc-400"
      : "[&>div]:bg-gradient-to-r [&>div]:from-zinc-500 [&>div]:to-zinc-700 dark:[&>div]:from-zinc-300 dark:[&>div]:to-zinc-500"
  return (
    <Card
      className={cn(
        "bg-white border-zinc-200 text-zinc-900 shadow-xs dark:bg-zinc-900/90 dark:border-zinc-800 dark:text-zinc-100 backdrop-blur supports-[backdrop-filter]:dark:bg-zinc-900/70",
        "rounded-2xl bg-gradient-to-b from-primary/5 to-card dark:*:data-[slot=card]:bg-card",
        className
      )}
      aria-label="Resumo do cartão de crédito"
    >
      <CardContent className="p-4 sm:p-5">
        {/* Top row: brand + bank */}
        <div className="flex items-start gap-3">
          <CreditCard aria-hidden="true" className="shrink-0 size-6 text-orange-400 mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold leading-none truncate">{brand}</h2>
              <button
                onClick={onFavoriteClick}
                className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label={favorite ? "Remover favorito" : "Adicionar favorito"}
              >
                <Star
                  className={cn(
                    "size-4",
                    favorite ? "fill-yellow-400 text-yellow-400" : "text-zinc-500"
                  )}
                />
              </button>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{bank}</p>
          </div>
        </div>
        {/* Highlighted available limit panel */}
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{"Limite disponível"}</p>
          <div className="mt-2 text-3xl sm:text-4xl font-normal tracking-tight">
            {formatCurrencyBRL(availableToShow)}
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            {"de "}{formatCurrencyBRL(total)}
          </p>
        </div>
        {/* Dates */}
        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-600 dark:text-zinc-400">{"Fechamento"}</p>
            <p className="mt-1 font-semibold">{formatShortDayMonth(closingDate)}</p>
          </div>
          <div>
            <p className="text-zinc-600 dark:text-zinc-400">{"Vencimento"}</p>
            <p className="mt-1 font-semibold">{formatShortDayMonth(dueDate)}</p>
          </div>
        </div>
        {/* Usage */}
        <div className="mt-5 px-0.5">
          <div className="flex items-center justify-between text-sm px-0.5">
            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">{"Limite usado"}</p>
            <p className="font-semibold text-xs sm:text-sm">{usedPercent.toFixed(1)}%</p>
          </div>
          <Progress
            value={usedPercent}
            aria-label="Progresso do limite usado"
            className={`mt-2 h-3 sm:h-4 bg-zinc-200 dark:bg-zinc-800 ${barColorClass}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface CreditCard {
  id: string
  name: string
  limit: number
  dueDate: number
  closingDate: number
  annualFee: number
  color: string
  favorite?: boolean
  brand?: string
  bank?: string
}

export default function CartoesPage() {
  const [cards, setCards] = useState<CreditCard[]>([
    { 
      id: '1', 
      name: 'Cartão Principal', 
      limit: 5000, 
      dueDate: 15, 
      closingDate: 5, 
      annualFee: 0, 
      color: '#ef4444',
      favorite: true,
      brand: 'Visa Platinum',
      bank: 'Banco do Brasil'
    },
    { 
      id: '2', 
      name: 'Cartão Nubank', 
      limit: 3000, 
      dueDate: 8, 
      closingDate: 28, 
      annualFee: 0, 
      color: '#8b5cf6',
      favorite: false,
      brand: 'Mastercard Black',
      bank: 'Nubank'
    },
    { 
      id: '3', 
      name: 'Cartão Itaú', 
      limit: 8000, 
      dueDate: 10, 
      closingDate: 25, 
      annualFee: 240, 
      color: '#3b82f6',
      favorite: false,
      brand: 'Visa Infinite',
      bank: 'Itaú Unibanco'
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    limit: 0,
    dueDate: 1,
    closingDate: 1,
    annualFee: 0,
    color: '#ef4444',
    favorite: false,
    bank: '',
    brand: ''
  })

  const limitFormat = useCurrencyFormat(formData.limit.toString())
  const annualFeeFormat = useCurrencyFormat(formData.annualFee.toString())

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

  

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("O nome do cartão é obrigatório")
      return
    }

    const limitValue = limitFormat.numericValue
    const annualFeeValue = annualFeeFormat.numericValue

    if (editingCard) {
      // Update existing card
      setCards(cards.map(card => 
        card.id === editingCard.id 
          ? { ...card, ...formData, limit: limitValue, annualFee: annualFeeValue }
          : card
      ))
      toast.success("Cartão atualizado com sucesso!")
    } else {
      // Add new card
      const newCard: CreditCard = {
        id: Date.now().toString(),
        ...formData,
        limit: limitValue,
        annualFee: annualFeeValue
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
      limit: card.limit,
      dueDate: card.dueDate,
      closingDate: card.closingDate,
      annualFee: card.annualFee,
      color: card.color,
      favorite: card.favorite || false,
      bank: card.bank || '',
      brand: card.brand || ''
    })
    // Update currency format values
    limitFormat.setValue(card.limit.toString())
    annualFeeFormat.setValue(card.annualFee.toString())
    setIsDialogOpen(true)
  }

  const handleFavoriteClick = (cardId: string) => {
    // Se houver apenas um cartão, não permite desmarcar
    if (cards.length === 1) {
      toast.error("Não é possível remover o favorito quando há apenas um cartão")
      return
    }

    setCards(cards.map(card => {
      // Se o cartão clicado já é favorito, remove o favorito
      if (card.id === cardId && card.favorite) {
        return { ...card, favorite: false }
      }
      // Se o cartão clicado não é favorito, torna ele favorito e remove dos outros
      if (card.id === cardId && !card.favorite) {
        return { ...card, favorite: true }
      }
      // Para os outros cartões, remove o favorito se tiverem
      return { ...card, favorite: false }
    }))
    
    const clickedCard = cards.find(card => card.id === cardId)
    const newFavoriteStatus = !clickedCard?.favorite
    toast.success(`Cartão ${newFavoriteStatus ? 'marcado como' : 'desmarcado como'} favorito!`)
  }

  const handleDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id))
    toast.success("Cartão excluído com sucesso!")
  }

  const resetForm = () => {
    setFormData({
      name: '',
      limit: 0,
      dueDate: 1,
      closingDate: 1,
      annualFee: 0,
      color: '#ef4444',
      favorite: false,
      bank: '',
      brand: ''
    })
    limitFormat.setValue('')
    annualFeeFormat.setValue('')
    setEditingCard(null)
    setIsDialogOpen(false)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  

  const renderCardCard = (card: CreditCard) => {
    // Create Date objects for closing and due dates
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    
    const closingDate = new Date(currentYear, currentMonth, card.closingDate)
    const dueDate = new Date(currentYear, currentMonth, card.dueDate)
    
    // Mock used amount (60-80% of limit for demonstration)
    const usedAmount = card.limit * (0.6 + Math.random() * 0.2)
    
    return (
      <div key={card.id} className="relative">
        <CreditCardSummary
          brand={card.brand || card.name}
          bank={card.bank || 'Banco'}
          available={card.limit - usedAmount}
          total={card.limit}
          closingDate={closingDate}
          dueDate={dueDate}
          favorite={card.favorite || false}
          usedAmount={usedAmount}
          onFavoriteClick={() => handleFavoriteClick(card.id)}
        />
        <div className="absolute top-2 right-2 z-10">
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
  const totalAnnualFee = cards.reduce((sum, card) => sum + card.annualFee, 0)

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

              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <CreditCard className="size-4" />
                        Limite Total
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
                        {formatCurrency(totalLimit)}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1">
                          <TrendingUp className="size-3 sm:size-4" />
                          <span className="font-medium">+3.8%</span>
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Limite consolidado <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Total de crédito disponível
                      </div>
                    </CardFooter>
                  </Card>
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <Wallet className="size-4" />
                        Total de Cartões
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
                        {cards.length}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1">
                          <TrendingUp className="size-3 sm:size-4" />
                          <span className="font-medium">+1</span>
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Cartões ativos <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Cartões cadastrados no sistema
                      </div>
                    </CardFooter>
                  </Card>
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <Percent className="size-4" />
                        Anuidade Total
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
                        {formatCurrency(totalAnnualFee)}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1">
                          <TrendingDown className="size-3 sm:size-4" />
                          <span className="font-medium">-2.1%</span>
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Custo anual <TrendingDown className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Total de anuidades por ano
                      </div>
                    </CardFooter>
                  </Card>
                </div>
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
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="name">Nome do cartão</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Cartão Principal"
                  />
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="bank">Banco</Label>
                  <Input
                    id="bank"
                    value={formData.bank}
                    onChange={(e) => setFormData({...formData, bank: e.target.value})}
                    placeholder="Ex: Banco do Brasil"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="limit">Limite</Label>
                  <Input
                    id="limit"
                    value={limitFormat.formattedValue}
                    onChange={limitFormat.handleChange}
                    placeholder="R$ 0,00"
                  />
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="annualFee">Anuidade</Label>
                  <Input
                    id="annualFee"
                    value={annualFeeFormat.formattedValue}
                    onChange={annualFeeFormat.handleChange}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="dueDate">Dia de vencimento</Label>
                  <Select value={formData.dueDate.toString()} onValueChange={(value) => setFormData({...formData, dueDate: parseInt(value)})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="closingDate">Dia de fechamento</Label>
                  <Select value={formData.closingDate.toString()} onValueChange={(value) => setFormData({...formData, closingDate: parseInt(value)})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="favorite">Favorito</Label>
                  <Select value={formData.favorite ? "true" : "false"} onValueChange={(value) => setFormData({...formData, favorite: value === "true"})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Não</SelectItem>
                      <SelectItem value="true">Sim</SelectItem>
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
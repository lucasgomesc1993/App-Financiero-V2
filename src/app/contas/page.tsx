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
import { useCurrencyFormat } from "@/hooks/use-currency-format"
import { Plus, Edit, Trash2, MoreHorizontal, CircleAlert, Building, TrendingUp, TrendingDown, Wallet, Star, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"

type AccountSummaryProps = {
  name: string
  balance: number
  color: string
  favorite?: boolean
  type?: string
  className?: string
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

export function AccountSummary(props: Partial<AccountSummaryProps>) {
  const {
    name = "Minha Conta",
    balance = 0,
    color = "#3b82f6",
    favorite = false,
    type = 'corrente',
    className,
    onFavoriteClick,
  } = props

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'corrente': return 'Conta Corrente'
      case 'poupanca': return 'Poupança'
      case 'investimento': return 'Investimento'
      case 'dinheiro': return 'Dinheiro'
      default: return 'Conta Corrente'
    }
  }

  return (
    <Card
      className={cn(
        "bg-white border-zinc-200 text-zinc-900 shadow-xs dark:bg-zinc-900/90 dark:border-zinc-800 dark:text-zinc-100 backdrop-blur supports-[backdrop-filter]:dark:bg-zinc-900/70",
        "rounded-2xl bg-gradient-to-b from-primary/5 to-card dark:*:data-[slot=card]:bg-card",
        className
      )}
      aria-label="Resumo da conta"
    >
      <CardContent className="p-4 sm:p-5">
        {/* Top row: name + favorite */}
        <div className="flex items-start gap-3">
          <Landmark aria-hidden="true" className="shrink-0 size-6 text-zinc-500 mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold leading-none truncate">{name}</h2>
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
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Conta bancária</p>
          </div>
        </div>
        {/* Highlighted balance panel */}
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{"Saldo atual"}</p>
          <div className="mt-2 text-3xl sm:text-4xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
            {balance >= 0 ? '' : '-'}{formatCurrencyBRL(Math.abs(balance))}
          </div>
        </div>
        {/* Account type indicator */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Wallet className="size-4 text-zinc-500" />
            <span className="text-zinc-600 dark:text-zinc-400">
              {getAccountTypeName(type)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface Account {
  id: string
  name: string
  balance: number
  color: string
  favorite?: boolean
  type?: string
}

export default function ContasPage() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Conta Corrente', balance: 5432.50, color: '#3b82f6', favorite: true, type: 'corrente' },
    { id: '2', name: 'Poupança', balance: 15000.00, color: '#22c55e', favorite: false, type: 'poupanca' },
    { id: '3', name: 'Investimentos', balance: 25000.00, color: '#8b5cf6', favorite: false, type: 'investimento' },
    { id: '4', name: 'Cartão de Crédito', balance: -1250.75, color: '#ef4444', favorite: false, type: 'credito' },
    { id: '5', name: 'Dinheiro', balance: 500.00, color: '#f97316', favorite: false, type: 'dinheiro' },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    color: '#3b82f6',
    favorite: false,
    type: ''
  })

  const currencyFormat = useCurrencyFormat(formData.balance)

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
    { name: 'Vermelho Escuro', value: '#dc2626' },
    { name: 'Laranja Escuro', value: '#ea580c' },
    { name: 'Verde Escuro', value: '#16a34a' },
    { name: 'Azul Escuro', value: '#2563eb' },
    { name: 'Roxo Escuro', value: '#7c3aed' },
    { name: 'Rosa Escuro', value: '#db2777' },
  ]

  const accountTypeOptions = [
    { name: 'Conta Corrente', value: 'corrente' },
    { name: 'Poupança', value: 'poupanca' },
    { name: 'Investimento', value: 'investimento' },
    { name: 'Dinheiro', value: 'dinheiro' },
  ]

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("O nome da conta é obrigatório")
      return
    }

    if (editingAccount) {
      // Update existing account
      let updatedAccounts = accounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, ...formData, balance: currencyFormat.numericValue }
          : acc
      )
      
      // Se a conta editada foi marcada como favorita, remove o favorito das outras contas
      if (formData.favorite) {
        updatedAccounts = updatedAccounts.map(acc => 
          acc.id === editingAccount.id 
            ? { ...acc, favorite: true }
            : { ...acc, favorite: false }
        )
      }
      
      setAccounts(updatedAccounts)
      toast.success("Conta atualizada com sucesso!")
    } else {
      // Add new account
      const newAccount: Account = {
        id: Date.now().toString(),
        name: formData.name,
        balance: currencyFormat.numericValue,
        color: formData.color,
        favorite: formData.favorite,
        type: formData.type
      }
      
      let updatedAccounts = [...accounts, newAccount]
      
      // Se a nova conta foi marcada como favorita, remove o favorito das outras contas
      if (formData.favorite) {
        updatedAccounts = updatedAccounts.map(acc => 
          acc.id === newAccount.id 
            ? { ...acc, favorite: true }
            : { ...acc, favorite: false }
        )
      }
      
      setAccounts(updatedAccounts)
      toast.success("Conta criada com sucesso!")
    }

    resetForm()
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      balance: account.balance.toString(),
      color: account.color,
      favorite: account.favorite || false,
      type: account.type || 'corrente'
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id))
    toast.success("Conta excluída com sucesso!")
  }

  const handleFavoriteClick = (accountId: string) => {
    // Se houver apenas uma conta, não permite desmarcar
    if (accounts.length === 1) {
      toast.error("Não é possível remover o favorito quando há apenas uma conta")
      return
    }

    setAccounts(accounts.map(account => {
      // Se a conta clicada já é favorita, remove o favorito
      if (account.id === accountId && account.favorite) {
        return { ...account, favorite: false }
      }
      // Se a conta clicada não é favorita, torna ela favorita e remove dos outros
      if (account.id === accountId && !account.favorite) {
        return { ...account, favorite: true }
      }
      // Para as outras contas, remove o favorito se tiverem
      return { ...account, favorite: false }
    }))
    
    const clickedAccount = accounts.find(account => account.id === accountId)
    const newFavoriteStatus = !clickedAccount?.favorite
    toast.success(`Conta ${newFavoriteStatus ? 'marcada como' : 'desmarcada como'} favorita!`)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      balance: '',
      color: '#3b82f6',
      favorite: false,
      type: ''
    })
    setEditingAccount(null)
    setIsDialogOpen(false)
  }

  const getCurrencySymbol = () => {
    return 'R$'
  }

  const formatCurrency = (value: number) => {
    const symbol = getCurrencySymbol()
    const formattedValue = Math.abs(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return `${symbol} ${formattedValue}`
  }

  const renderAccountCard = (account: Account) => {
    return (
      <div key={account.id} className="relative">
        <AccountSummary
          name={account.name}
          balance={account.balance}
          color={account.color}
          favorite={account.favorite || false}
          type={account.type || 'corrente'}
          onFavoriteClick={() => handleFavoriteClick(account.id)}
        />
        <div className="absolute top-2 right-2 z-10">
          <AccountActionsDropdown 
            account={account}
            onEdit={() => handleEdit(account)}
            onDelete={() => handleDelete(account.id)}
          />
        </div>
      </div>
    )
  }

  // Component for delete confirmation dialog
  function DeleteAccountDialog({ 
    account, 
    onDelete 
  }: { 
    account: Account
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
                Tem certeza que deseja excluir a conta "{account.name}"? Esta ação não pode ser desfeita.
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
  function AccountActionsDropdown({ 
    account, 
    onEdit, 
    onDelete 
  }: { 
    account: Account
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
          <DeleteAccountDialog 
            account={account}
            onDelete={onDelete}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

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
                    <h1 className="text-2xl font-bold tracking-tight">Contas</h1>
                    <p className="text-muted-foreground">
                      Gerencie suas contas bancárias e saldos
                    </p>
                  </div>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Conta
                  </Button>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2">
                        <Building className="size-4" />
                        Saldo Total
                      </CardDescription>
                      <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
                        {totalBalance >= 0 ? '' : '-'}{formatCurrency(Math.abs(totalBalance))}
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1">
                          <TrendingUp className="size-3 sm:size-4" />
                          <span className="font-medium">+5.2%</span>
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Saldo consolidado <TrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Total em {accounts.length} contas
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Minhas Contas</CardTitle>
                    <CardDescription>
                      Gerencie suas contas e acompanhe os saldos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                      {accounts.map(renderAccountCard)}
                    </div>
                    {accounts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground col-span-full">
                        <Building className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Nenhuma conta cadastrada</p>
                        <p className="text-sm">Clique em "Nova Conta" para adicionar sua primeira conta</p>
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
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </DialogTitle>
              <DialogDescription>
                {editingAccount 
                  ? 'Atualize as informações da conta abaixo.'
                  : 'Preencha as informações para criar uma nova conta.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor="name">Nome da Conta</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Conta Corrente"
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="balance">Saldo Inicial</Label>
                <Input
                  id="balance"
                  placeholder="R$ 0,00"
                  value={currencyFormat.formattedValue}
                  onChange={currencyFormat.handleChange}
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                {editingAccount ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
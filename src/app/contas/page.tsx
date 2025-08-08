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
import { Plus, Edit, Trash2, MoreHorizontal, CircleAlert, Building, University, CreditCard, Wallet, PiggyBank, Landmark, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface Account {
  id: string
  name: string
  type: 'corrente' | 'poupanca' | 'investimento' | 'cartao' | 'dinheiro'
  balance: number
  currency: 'BRL' | 'USD' | 'EUR'
  color: string
  icon: string
}

export default function ContasPage() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Conta Corrente', type: 'corrente', balance: 5432.50, currency: 'BRL', color: '#3b82f6', icon: 'Building' },
    { id: '2', name: 'Poupança', type: 'poupanca', balance: 15000.00, currency: 'BRL', color: '#22c55e', icon: 'PiggyBank' },
    { id: '3', name: 'Investimentos', type: 'investimento', balance: 25000.00, currency: 'BRL', color: '#8b5cf6', icon: 'TrendingUp' },
    { id: '4', name: 'Cartão de Crédito', type: 'cartao', balance: -1250.75, currency: 'BRL', color: '#ef4444', icon: 'CreditCard' },
    { id: '5', name: 'Dinheiro', type: 'dinheiro', balance: 500.00, currency: 'BRL', color: '#f97316', icon: 'Wallet' },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'corrente' as 'corrente' | 'poupanca' | 'investimento' | 'cartao' | 'dinheiro',
    balance: 0,
    currency: 'BRL' as 'BRL' | 'USD' | 'EUR',
    color: '#3b82f6',
    icon: 'Building'
  })

  const colorOptions = [
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#22c55e' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Amarelo', value: '#eab308' },
    { name: 'Ciano', value: '#06b6d4' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Cinza', value: '#6b7280' },
  ]

  const iconOptions = [
    { name: 'Prédio', value: 'Building' },
    { name: 'Universidade', value: 'University' },
    { name: 'Cartão', value: 'CreditCard' },
    { name: 'Carteira', value: 'Wallet' },
    { name: 'Porco', value: 'PiggyBank' },
    { name: 'Banco', value: 'Landmark' },
    { name: 'Dólar', value: 'DollarSign' },
    { name: 'Tendência Alta', value: 'TrendingUp' },
    { name: 'Tendência Baixa', value: 'TrendingDown' },
  ]

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("O nome da conta é obrigatório")
      return
    }

    if (editingAccount) {
      // Update existing account
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, ...formData }
          : acc
      ))
      toast.success("Conta atualizada com sucesso!")
    } else {
      // Add new account
      const newAccount: Account = {
        id: Date.now().toString(),
        ...formData
      }
      setAccounts([...accounts, newAccount])
      toast.success("Conta criada com sucesso!")
    }

    resetForm()
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      color: account.color,
      icon: account.icon
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id))
    toast.success("Conta excluída com sucesso!")
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'corrente',
      balance: 0,
      currency: 'BRL',
      color: '#3b82f6',
      icon: 'Building'
    })
    setEditingAccount(null)
    setIsDialogOpen(false)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'corrente': return 'Conta Corrente'
      case 'poupanca': return 'Poupança'
      case 'investimento': return 'Investimento'
      case 'cartao': return 'Cartão de Crédito'
      case 'dinheiro': return 'Dinheiro'
      default: return type
    }
  }

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'R$'
      case 'USD': return '$'
      case 'EUR': return '€'
      default: return currency
    }
  }

  const formatCurrency = (value: number, currency: string) => {
    const symbol = getCurrencySymbol(currency)
    return `${symbol} ${Math.abs(value).toFixed(2)}`
  }

  const renderIcon = (iconName: string, color: string, size: number = 16) => {
    const iconProps = {
      size,
      style: { color },
      strokeWidth: 2
    }

    switch (iconName) {
      case 'Building': return <Building {...iconProps} />
      case 'University': return <University {...iconProps} />
      case 'CreditCard': return <CreditCard {...iconProps} />
      case 'Wallet': return <Wallet {...iconProps} />
      case 'PiggyBank': return <PiggyBank {...iconProps} />
      case 'Landmark': return <Landmark {...iconProps} />
      case 'DollarSign': return <DollarSign {...iconProps} />
      case 'TrendingUp': return <TrendingUp {...iconProps} />
      case 'TrendingDown': return <TrendingDown {...iconProps} />
      default: return <Building {...iconProps} />
    }
  }

  const renderAccountCard = (account: Account) => (
    <div
      key={account.id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <div className="flex items-center gap-3">
        {renderIcon(account.icon, account.color, 20)}
        <div>
          <p className="font-medium">{account.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {getTypeLabel(account.type)}
            </Badge>
            <span className={`text-sm font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {account.balance >= 0 ? '' : '-'}{formatCurrency(account.balance, account.currency)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <AccountActionsDropdown 
          account={account}
          onEdit={() => handleEdit(account)}
          onDelete={() => handleDelete(account.id)}
        />
      </div>
    </div>
  )

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
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo Financeiro</CardTitle>
                    <CardDescription>
                      Visão geral do saldo total em todas as contas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {totalBalance >= 0 ? '' : '-'}{formatCurrency(Math.abs(totalBalance), 'BRL')}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Saldo total em {accounts.length} contas
                    </p>
                  </CardContent>
                </Card>
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {accounts.map(renderAccountCard)}
                    </div>
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
                <Label htmlFor="type">Tipo de Conta</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrente">Conta Corrente</SelectItem>
                    <SelectItem value="poupanca">Poupança</SelectItem>
                    <SelectItem value="investimento">Investimento</SelectItem>
                    <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="balance">Saldo Inicial</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select value={formData.currency} onValueChange={(value: any) => setFormData({...formData, currency: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
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
                {editingAccount ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
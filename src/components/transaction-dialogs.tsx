"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerCustom } from "@/components/ui/date-picker-custom"
import { useCurrencyFormat } from "@/hooks/use-currency-format"
import { toast } from "sonner"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'despesa' | 'receita' | 'despesa_cartao' | 'transferencia'
}

// Mock data for categories and accounts
const categories = {
  despesa: [
    "Alimentação", "Educação", "Lazer", "Moradia", "Outros", 
    "Saúde", "Transporte", "Utilidades", "Vestuário"
  ],
  receita: [
    "Aluguel", "Freelance", "Investimentos", "Outros", "Salário", "Vendas"
  ],
  despesa_cartao: [
    "Assinaturas", "Combustível", "Farmácia", "Outros", "Restaurante", 
    "Shopping", "Supermercado", "Viagem"
  ]
}

const bankAccounts = [
  "Conta Corrente Santander",
  "Conta Poupança Caixa", 
  "Conta Corrente Itaú",
  "Conta Corrente Bradesco",
  "Conta Corrente Nubank"
]

const creditCards = [
  "Cartão Nubank",
  "Cartão Itaú",
  "Cartão Santander",
  "Cartão Bradesco",
  "Cartão Inter"
]

export function TransactionDialog({ open, onOpenChange, type }: TransactionDialogProps) {
  // Função para gerar opções de meses para fatura
  const getInvoiceMonths = () => {
    const months = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    
    // Gerar meses do ano atual e próximo ano
    for (let year = currentYear; year <= currentYear + 1; year++) {
      const startMonth = year === currentYear ? currentMonth : 0
      const endMonth = 12
      
      for (let month = startMonth; month < endMonth; month++) {
        const date = new Date(year, month, 1)
        const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        const value = `${year}-${String(month + 1).padStart(2, '0')}`
        const isCurrent = year === currentYear && month === currentMonth
        
        months.push({
          value,
          label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          isCurrent
        })
      }
    }
    
    return months
  }

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    conta: '',
    cartao: '',
    contaOrigem: '',
    contaDestino: '',
    data: new Date(),
    fatura: '' // Novo campo para fatura
  })

  // Inicializar fatura com o mês atual quando o componente montar
  useEffect(() => {
    const currentDate = new Date()
    const currentMonthValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    setFormData(prev => ({ ...prev, fatura: currentMonthValue }))
  }, [])

  const currencyFormat = useCurrencyFormat(formData.valor)

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = getRequiredFields(type)
    const errors = []

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors.push(field)
      }
    })

    if (errors.length > 0) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    if (currencyFormat.numericValue <= 0) {
      toast.error("O valor deve ser maior que zero")
      return
    }

    // Success - in a real app, this would save to a database
    const transactionType = type === 'despesa_cartao' ? 'Despesa no cartão' : 
                          type === 'transferencia' ? 'Transferência' : 
                          type.charAt(0).toUpperCase() + type.slice(1)
    
    toast.success(`${transactionType} registrada com sucesso!`)
    
    // Reset form and close
    const currentDate = new Date()
    const currentMonthValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    setFormData({
      descricao: '',
      valor: '',
      categoria: '',
      conta: '',
      cartao: '',
      contaOrigem: '',
      contaDestino: '',
      data: new Date(),
      fatura: currentMonthValue
    })
    onOpenChange(false)
  }

  const getRequiredFields = (type: string) => {
    switch (type) {
      case 'despesa':
        return ['descricao', 'categoria', 'conta', 'data']
      case 'receita':
        return ['descricao', 'categoria', 'conta', 'data']
      case 'despesa_cartao':
        return ['descricao', 'categoria', 'cartao', 'fatura', 'data']
      case 'transferencia':
        return ['contaOrigem', 'contaDestino', 'data']
      default:
        return []
    }
  }

  const renderForm = () => {
    switch (type) {
      case 'despesa':
        return (
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Ex: Supermercado"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  placeholder="R$ 0,00"
                  value={currencyFormat.formattedValue}
                  onChange={currencyFormat.handleChange}
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="data">Data</Label>
                <DatePickerCustom
                  value={formData.data}
                  onChange={(date) => setFormData({...formData, data: date || new Date()})}
                />
              </div>
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.despesa.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="conta">Conta Bancária</Label>
              <Select value={formData.conta} onValueChange={(value) => setFormData({...formData, conta: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar conta bancária" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'receita':
        return (
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Ex: Salário"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  placeholder="R$ 0,00"
                  value={currencyFormat.formattedValue}
                  onChange={currencyFormat.handleChange}
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="data">Data</Label>
                <DatePickerCustom
                  value={formData.data}
                  onChange={(date) => setFormData({...formData, data: date || new Date()})}
                />
              </div>
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.receita.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="conta">Conta Bancária</Label>
              <Select value={formData.conta} onValueChange={(value) => setFormData({...formData, conta: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar conta bancária" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'despesa_cartao':
        return (
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Ex: Restaurante"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  placeholder="R$ 0,00"
                  value={currencyFormat.formattedValue}
                  onChange={currencyFormat.handleChange}
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="data">Data</Label>
                <DatePickerCustom
                  value={formData.data}
                  onChange={(date) => setFormData({...formData, data: date || new Date()})}
                />
              </div>
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.despesa_cartao.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="cartao">Cartão de Crédito</Label>
              <Select value={formData.cartao} onValueChange={(value) => setFormData({...formData, cartao: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar cartão" />
                </SelectTrigger>
                <SelectContent>
                  {creditCards.map((card) => (
                    <SelectItem key={card} value={card}>
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="fatura">Fatura</Label>
              <Select value={formData.fatura} onValueChange={(value) => setFormData({...formData, fatura: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar fatura" />
                </SelectTrigger>
                <SelectContent>
                  {getInvoiceMonths().map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                      {month.isCurrent && (
                        <span className="ml-2 text-xs text-blue-600">(Atual)</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'transferencia':
        return (
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor="contaOrigem">Conta de Origem</Label>
              <Select value={formData.contaOrigem} onValueChange={(value) => setFormData({...formData, contaOrigem: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar conta de origem" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="contaDestino">Conta de Destino</Label>
              <Select value={formData.contaDestino} onValueChange={(value) => setFormData({...formData, contaDestino: value})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar conta de destino" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts
                    .filter(account => account !== formData.contaOrigem)
                    .map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  placeholder="R$ 0,00"
                  value={currencyFormat.formattedValue}
                  onChange={currencyFormat.handleChange}
                />
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="data">Data</Label>
                <DatePickerCustom
                  value={formData.data}
                  onChange={(date) => setFormData({...formData, data: date || new Date()})}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getDialogTitle = () => {
    switch (type) {
      case 'despesa': return 'Adicionar Despesa'
      case 'receita': return 'Adicionar Receita'
      case 'despesa_cartao': return 'Adicionar Despesa no Cartão'
      case 'transferencia': return 'Adicionar Transferência'
      default: return 'Adicionar Transação'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Preencha os dados da transação abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {renderForm()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
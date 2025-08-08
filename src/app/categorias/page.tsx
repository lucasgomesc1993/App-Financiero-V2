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
import { Plus, Edit, Trash2, TrendingDown, TrendingUp, ShoppingCart, Utensils, Home, Car, Heart, GraduationCap, Gamepad2, Shirt, Zap, MoreHorizontal, DollarSign, Banknote, Building, Store, CircleAlert, Palmtree, Plane, Gift, Coffee, Smartphone, Headphones, Camera, Music, BookOpen, Briefcase, Wrench, PiggyBank, CreditCard, Wallet, PieChart, BarChart3, Target, Users, Star, Award, Trophy, Bell, MessageSquare, Mail, Phone, MapPin, Calendar, Clock, Shield, CheckCircle, AlertCircle, Info } from "lucide-react"

interface Category {
  id: string
  name: string
  type: 'despesa' | 'receita'
  color: string
  icon: string
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Alimentação', type: 'despesa', color: '#ef4444', icon: 'Utensils' },
    { id: '2', name: 'Transporte', type: 'despesa', color: '#f97316', icon: 'Car' },
    { id: '3', name: 'Saúde', type: 'despesa', color: '#eab308', icon: 'Heart' },
    { id: '4', name: 'Educação', type: 'despesa', color: '#22c55e', icon: 'GraduationCap' },
    { id: '5', name: 'Lazer', type: 'despesa', color: '#06b6d4', icon: 'Gamepad2' },
    { id: '6', name: 'Moradia', type: 'despesa', color: '#3b82f6', icon: 'Home' },
    { id: '7', name: 'Vestuário', type: 'despesa', color: '#8b5cf6', icon: 'Shirt' },
    { id: '8', name: 'Utilidades', type: 'despesa', color: '#ec4899', icon: 'Zap' },
    { id: '9', name: 'Outros', type: 'despesa', color: '#6b7280', icon: 'MoreHorizontal' },
    { id: '10', name: 'Salário', type: 'receita', color: '#22c55e', icon: 'DollarSign' },
    { id: '11', name: 'Freelance', type: 'receita', color: '#06b6d4', icon: 'Banknote' },
    { id: '12', name: 'Investimentos', type: 'receita', color: '#3b82f6', icon: 'Building' },
    { id: '13', name: 'Aluguel', type: 'receita', color: '#8b5cf6', icon: 'Home' },
    { id: '14', name: 'Vendas', type: 'receita', color: '#ec4899', icon: 'Store' },
    { id: '15', name: 'Outros', type: 'receita', color: '#6b7280', icon: 'MoreHorizontal' },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'despesa' as 'despesa' | 'receita',
    color: '#3b82f6',
    icon: 'MoreHorizontal'
  })

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

  const iconOptions = [
    { name: 'Utensílios', value: 'Utensils' },
    { name: 'Carro', value: 'Car' },
    { name: 'Casa', value: 'Home' },
    { name: 'Coração', value: 'Heart' },
    { name: 'Graduação', value: 'GraduationCap' },
    { name: 'Jogos', value: 'Gamepad2' },
    { name: 'Camisa', value: 'Shirt' },
    { name: 'Raio', value: 'Zap' },
    { name: 'Mais', value: 'MoreHorizontal' },
    { name: 'Dólar', value: 'DollarSign' },
    { name: 'Cédula', value: 'Banknote' },
    { name: 'Prédio', value: 'Building' },
    { name: 'Loja', value: 'Store' },
    { name: 'Carrinho', value: 'ShoppingCart' },
    { name: 'Palmeira', value: 'Palmtree' },
    { name: 'Avião', value: 'Plane' },
    { name: 'Presente', value: 'Gift' },
    { name: 'Café', value: 'Coffee' },
    { name: 'Smartphone', value: 'Smartphone' },
    { name: 'Fone', value: 'Headphones' },
    { name: 'Câmera', value: 'Camera' },
    { name: 'Música', value: 'Music' },
    { name: 'Livro', value: 'BookOpen' },
    { name: 'Pasta', value: 'Briefcase' },
    { name: 'Chave', value: 'Wrench' },
    { name: 'Porco', value: 'PiggyBank' },
    { name: 'Cartão', value: 'CreditCard' },
    { name: 'Carteira', value: 'Wallet' },
    { name: 'Pizza', value: 'PieChart' },
    { name: 'Gráfico', value: 'BarChart3' },
    { name: 'Alvo', value: 'Target' },
    { name: 'Usuários', value: 'Users' },
    { name: 'Estrela', value: 'Star' },
    { name: 'Prêmio', value: 'Award' },
    { name: 'Troféu', value: 'Trophy' },
    { name: 'Sino', value: 'Bell' },
    { name: 'Chat', value: 'MessageSquare' },
    { name: 'Email', value: 'Mail' },
    { name: 'Telefone', value: 'Phone' },
    { name: 'Local', value: 'MapPin' },
    { name: 'Calendário', value: 'Calendar' },
    { name: 'Relógio', value: 'Clock' },
    { name: 'Proteção', value: 'Shield' },
    { name: 'Check', value: 'CheckCircle' },
    { name: 'Alerta', value: 'AlertCircle' },
    { name: 'Info', value: 'Info' },
  ]

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("O nome da categoria é obrigatório")
      return
    }

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ))
      toast.success("Categoria atualizada com sucesso!")
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData
      }
      setCategories([...categories, newCategory])
      toast.success("Categoria criada com sucesso!")
    }

    resetForm()
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id))
    toast.success("Categoria excluída com sucesso!")
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'despesa',
      color: '#3b82f6',
      icon: 'MoreHorizontal'
    })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'despesa': return 'Despesa'
      case 'receita': return 'Receita'
      default: return type
    }
  }

  const filteredCategories = (type: string) => {
    return categories.filter(cat => cat.type === type)
  }

  const renderIcon = (iconName: string, color: string, size: number = 16) => {
    const iconProps = {
      size,
      style: { color },
      strokeWidth: 2
    }

    switch (iconName) {
      case 'Utensils': return <Utensils {...iconProps} />
      case 'Car': return <Car {...iconProps} />
      case 'Home': return <Home {...iconProps} />
      case 'Heart': return <Heart {...iconProps} />
      case 'GraduationCap': return <GraduationCap {...iconProps} />
      case 'Gamepad2': return <Gamepad2 {...iconProps} />
      case 'Shirt': return <Shirt {...iconProps} />
      case 'Zap': return <Zap {...iconProps} />
      case 'MoreHorizontal': return <MoreHorizontal {...iconProps} />
      case 'DollarSign': return <DollarSign {...iconProps} />
      case 'Banknote': return <Banknote {...iconProps} />
      case 'Building': return <Building {...iconProps} />
      case 'Store': return <Store {...iconProps} />
      case 'ShoppingCart': return <ShoppingCart {...iconProps} />
      case 'Palmtree': return <Palmtree {...iconProps} />
      case 'Plane': return <Plane {...iconProps} />
      case 'Gift': return <Gift {...iconProps} />
      case 'Coffee': return <Coffee {...iconProps} />
      case 'Smartphone': return <Smartphone {...iconProps} />
      case 'Headphones': return <Headphones {...iconProps} />
      case 'Camera': return <Camera {...iconProps} />
      case 'Music': return <Music {...iconProps} />
      case 'BookOpen': return <BookOpen {...iconProps} />
      case 'Briefcase': return <Briefcase {...iconProps} />
      case 'Wrench': return <Wrench {...iconProps} />
      case 'PiggyBank': return <PiggyBank {...iconProps} />
      case 'CreditCard': return <CreditCard {...iconProps} />
      case 'Wallet': return <Wallet {...iconProps} />
      case 'PieChart': return <PieChart {...iconProps} />
      case 'BarChart3': return <BarChart3 {...iconProps} />
      case 'Target': return <Target {...iconProps} />
      case 'Users': return <Users {...iconProps} />
      case 'Star': return <Star {...iconProps} />
      case 'Award': return <Award {...iconProps} />
      case 'Trophy': return <Trophy {...iconProps} />
      case 'Bell': return <Bell {...iconProps} />
      case 'MessageSquare': return <MessageSquare {...iconProps} />
      case 'Mail': return <Mail {...iconProps} />
      case 'Phone': return <Phone {...iconProps} />
      case 'MapPin': return <MapPin {...iconProps} />
      case 'Calendar': return <Calendar {...iconProps} />
      case 'Clock': return <Clock {...iconProps} />
      case 'Shield': return <Shield {...iconProps} />
      case 'CheckCircle': return <CheckCircle {...iconProps} />
      case 'AlertCircle': return <AlertCircle {...iconProps} />
      case 'Info': return <Info {...iconProps} />
      default: return <MoreHorizontal {...iconProps} />
    }
  }

  const renderCategoryCard = (category: Category) => (
    <div
      key={category.id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <div className="flex items-center gap-3">
        {renderIcon(category.icon, category.color, 20)}
        <div>
          <p className="font-medium">{category.name}</p>
          <Badge variant="secondary" className="text-xs">
            {getTypeLabel(category.type)}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <CategoryActionsDropdown 
          category={category}
          onEdit={() => handleEdit(category)}
          onDelete={() => handleDelete(category.id)}
        />
      </div>
    </div>
  )

  // Component for delete confirmation dialog
  function DeleteCategoryDialog({ 
    category, 
    onDelete 
  }: { 
    category: Category
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
                Tem certeza que deseja excluir a categoria "{category.name}"? Esta ação não pode ser desfeita.
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
  function CategoryActionsDropdown({ 
    category, 
    onEdit, 
    onDelete 
  }: { 
    category: Category
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
          <DeleteCategoryDialog 
            category={category}
            onDelete={onDelete}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

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
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                    <p className="text-muted-foreground">
                      Gerencie as categorias para organizar suas transações
                    </p>
                  </div>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Categoria
                  </Button>
                </div>

                <Tabs defaultValue="despesas" className="w-full mt-6">
                  <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="despesas"
                      className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <TrendingDown
                        className="mb-1.5 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                      Despesas
                    </TabsTrigger>
                    <TabsTrigger
                      value="receitas"
                      className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <TrendingUp
                        className="mb-1.5 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                      Receitas
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="despesas" className="space-y-6">
                    {/* Despesas Categories */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Categorias de Despesas
                        </CardTitle>
                        <CardDescription>
                          Categorias para organizar seus gastos e despesas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                          {filteredCategories('despesa').map(renderCategoryCard)}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="receitas" className="space-y-6">
                    {/* Receitas Categories */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Categorias de Receitas
                        </CardTitle>
                        <CardDescription>
                          Categorias para organizar suas entradas e receitas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                          {filteredCategories('receita').map(renderCategoryCard)}
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

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Atualize as informações da categoria abaixo.'
                : 'Preencha os dados para criar uma nova categoria.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                placeholder="Ex: Alimentação"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="despesa">Despesa</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
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
              {editingCategory ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
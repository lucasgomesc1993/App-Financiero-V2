"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { 
  BellIcon, 
  CreditCardIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  InfoIcon,
  SearchIcon,
  FilterIcon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react"
import { useNotifications } from "@/contexts/notifications-context"

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAsUnread, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications()
  
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const notificationsPerPage = 6

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || notification.type === filterType
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage)
  const startIndex = (currentPage - 1) * notificationsPerPage
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + notificationsPerPage)

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(notificationId => notificationId !== id) : [...prev, id]
    )
  }

  const toggleAllSelections = () => {
    if (selectedNotifications.length === currentNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(currentNotifications.map(n => n.id))
    }
  }

  const deleteSelected = () => {
    selectedNotifications.forEach(deleteNotification)
    setSelectedNotifications([])
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
                    <p className="text-muted-foreground">
                      Gerencie suas notificações e mantenha-se atualizado
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <BellIcon className="h-3 w-3" />
                        {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      Marcar todas como lidas
                    </Button>
                  </div>
                </div>

                {/* Filtros e Busca */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Buscar notificações..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-[180px]">
                            <FilterIcon className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filtrar por tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="payment">Pagamentos</SelectItem>
                            <SelectItem value="budget">Orçamentos</SelectItem>
                            <SelectItem value="transaction">Transações</SelectItem>
                            <SelectItem value="system">Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ações em Massa */}
                {selectedNotifications.length > 0 && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {selectedNotifications.length} notificação{selectedNotifications.length > 1 ? 'ões' : ''} selecionada{selectedNotifications.length > 1 ? 's' : ''}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => selectedNotifications.forEach(markAsRead)}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            Marcar como lidas
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => selectedNotifications.forEach(markAsUnread)}>
                            <EyeOffIcon className="mr-2 h-4 w-4" />
                            Marcar como não lidas
                          </Button>
                          <Button variant="destructive" size="sm" onClick={deleteSelected}>
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            Excluir selecionadas
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lista de Notificações */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Notificações</CardTitle>
                        <CardDescription>
                          {filteredNotifications.length} notificação{filteredNotifications.length > 1 ? 'ões' : ''}
                          {filterType !== "all" && ` • Filtrado por: ${filterType}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedNotifications.length === currentNotifications.length && currentNotifications.length > 0}
                          onCheckedChange={toggleAllSelections}
                        />
                        <span className="text-sm text-muted-foreground">Selecionar todas</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentNotifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <BellIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                          <p>Nenhuma notificação encontrada</p>
                        </div>
                      ) : (
                        currentNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                              !notification.read ? 'bg-muted/30' : ''
                            }`}
                          >
                            <Checkbox
                              checked={selectedNotifications.includes(notification.id)}
                              onCheckedChange={() => toggleNotificationSelection(notification.id)}
                              className="mt-1"
                            />
                            <div className={`flex-shrink-0 mt-0.5 ${notification.iconColor}`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {notification.timestamp}
                                  </span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <span className="sr-only">Abrir menu</span>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {notification.read ? (
                                        <DropdownMenuItem onClick={() => markAsUnread(notification.id)}>
                                          <EyeOffIcon className="mr-2 h-4 w-4" />
                                          Marcar como não lida
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                          <EyeIcon className="mr-2 h-4 w-4" />
                                          Marcar como lida
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem onClick={() => deleteNotification(notification.id)} className="text-destructive">
                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {notification.type === 'payment' && 'Pagamento'}
                                  {notification.type === 'budget' && 'Orçamento'}
                                  {notification.type === 'transaction' && 'Transação'}
                                  {notification.type === 'system' && 'Sistema'}
                                </Badge>
                                {!notification.read && (
                                  <Badge variant="destructive" className="text-xs">
                                    Não lida
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Mostrando {startIndex + 1}-{Math.min(startIndex + notificationsPerPage, filteredNotifications.length)} de {filteredNotifications.length} notificações
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeftIcon className="h-4 w-4" />
                            Anterior
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum
                              if (totalPages <= 5) {
                                pageNum = i + 1
                              } else if (currentPage <= 3) {
                                pageNum = i + 1
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                              } else {
                                pageNum = currentPage - 2 + i
                              }
                              
                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setCurrentPage(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              )
                            })}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Próximo
                            <ChevronRightIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
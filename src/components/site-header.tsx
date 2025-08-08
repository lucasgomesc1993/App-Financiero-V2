"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BellIcon, CreditCardIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/contexts/notifications-context"

export function SiteHeader() {
  const pathname = usePathname()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  
  // Mapeamento de rotas para títulos
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Dashboard"
      case "/transacoes":
        return "Transações"
      case "/notificacoes":
        return "Notificações"
      case "/photo-editor":
        return "Editor de Fotos"
      case "/dashboard":
        return "Dashboard"
      default:
        // Remove a barra inicial e capitaliza
        const pathWithoutSlash = path.replace(/^\//, "")
        return pathWithoutSlash.charAt(0).toUpperCase() + pathWithoutSlash.slice(1)
    }
  }
  
  const title = getPageTitle(pathname)

  // Pegar apenas as 3 notificações mais recentes para o dropdown
  const recentNotifications = notifications.slice(0, 3)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <BellIcon className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notificações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h4 className="text-sm font-medium">Notificações</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-xs" onClick={markAllAsRead}>
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
              
              {/* Notificações recentes */}
              {recentNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BellIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                recentNotifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className="flex-col items-start p-4 cursor-pointer"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className={`flex-shrink-0 mt-0.5 ${notification.iconColor}`}>
                        {notification.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="destructive" className="text-xs">
                              Não lida
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              
              <div className="px-4 py-2 border-t">
                <Link href="/notificacoes">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todas as notificações
                  </Button>
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
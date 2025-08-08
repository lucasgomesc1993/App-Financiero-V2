"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { 
  CreditCardIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  InfoIcon 
} from 'lucide-react'

interface Notification {
  id: string
  type: 'payment' | 'budget' | 'transaction' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  icon: React.ReactNode
  iconColor: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAsUnread: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  updateNotifications: (newNotifications: Notification[]) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

interface NotificationsProviderProps {
  children: ReactNode
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "payment",
      title: "Pagamento de fatura",
      message: "Sua fatura do Nubank no valor de R$ 1.250,75 vence em 3 dias",
      timestamp: "2h atrás",
      read: false,
      icon: <CreditCardIcon className="h-4 w-4" />,
      iconColor: "text-blue-600"
    },
    {
      id: "2",
      type: "budget",
      title: "Alerta de orçamento",
      message: "Você atingiu 85% do seu orçamento de alimentação este mês",
      timestamp: "1d atrás",
      read: false,
      icon: <AlertTriangleIcon className="h-4 w-4" />,
      iconColor: "text-orange-600"
    },
    {
      id: "3",
      type: "transaction",
      title: "Transação confirmada",
      message: "Seu pagamento de salário no valor de R$ 5.500,00 foi confirmado",
      timestamp: "2d atrás",
      read: true,
      icon: <CheckCircleIcon className="h-4 w-4" />,
      iconColor: "text-green-600"
    },
    {
      id: "4",
      type: "system",
      title: "Atualização do sistema",
      message: "Nova funcionalidade de relatórios disponível em sua dashboard",
      timestamp: "3d atrás",
      read: true,
      icon: <InfoIcon className="h-4 w-4" />,
      iconColor: "text-gray-600"
    },
    {
      id: "5",
      type: "payment",
      title: "Fatura paga",
      message: "Sua fatura do Itaú no valor de R$ 890,50 foi paga com sucesso",
      timestamp: "4d atrás",
      read: true,
      icon: <CreditCardIcon className="h-4 w-4" />,
      iconColor: "text-blue-600"
    },
    {
      id: "6",
      type: "budget",
      title: "Meta de economia",
      message: "Você atingiu 75% da sua meta de economia deste mês",
      timestamp: "5d atrás",
      read: false,
      icon: <CheckCircleIcon className="h-4 w-4" />,
      iconColor: "text-green-600"
    },
    {
      id: "7",
      type: "transaction",
      title: "Transferência recebida",
      message: "Você recebeu R$ 1.200,00 de João Silva",
      timestamp: "1 semana atrás",
      read: true,
      icon: <CheckCircleIcon className="h-4 w-4" />,
      iconColor: "text-green-600"
    },
    {
      id: "8",
      type: "system",
      title: "Lembrete de segurança",
      message: "Por favor, atualize sua senha para maior segurança da conta",
      timestamp: "1 semana atrás",
      read: false,
      icon: <AlertTriangleIcon className="h-4 w-4" />,
      iconColor: "text-orange-600"
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: false } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const updateNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications)
  }

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    addNotification,
    updateNotifications
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}
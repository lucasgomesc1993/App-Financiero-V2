"use client"

import * as React from "react"
import {
  IconArrowsExchange,
  IconBuildingBank,
  IconCategory,
  IconChartPie,
  IconCreditCard,
  IconDashboard,
  IconInnerShadowTop,
  IconReport,
  IconSettings,
  IconTarget,
  IconPlus,
  IconChevronDown,
  IconTrendingDown,
  IconTrendingUp,
  IconCreditCardPay,
  IconTransfer,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TransactionDialog } from "@/components/transaction-dialogs"
import { useState } from "react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/logo.svg",
  },
  navMain: [
    {
      title: "Visão Geral",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: IconDashboard,
        },
      ],
    },
    {
      title: "Financeiro",
      items: [
        {
          title: "Transações",
          url: "/transacoes",
          icon: IconArrowsExchange,
        },
        {
          title: "Contas",
          url: "/contas",
          icon: IconBuildingBank,
        },
        {
          title: "Cartões",
          url: "/cartoes",
          icon: IconCreditCard,
        },
      ],
    },
    {
      title: "Organização",
      items: [
        {
          title: "Categorias",
          url: "/categorias",
          icon: IconCategory,
        },
        {
          title: "Orçamentos",
          url: "/orcamentos",
          icon: IconChartPie,
        },
        {
          title: "Metas",
          url: "/metas",
          icon: IconTarget,
        },
      ],
    },
    {
      title: "Análise",
      items: [
        {
          title: "Relatórios",
          url: "/relatorios",
          icon: IconReport,
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          title: "Configurações",
          url: "/configuracoes",
          icon: IconSettings,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'despesa' | 'receita' | 'despesa_cartao' | 'transferencia'>('despesa')

  const handleTransactionClick = (type: 'despesa' | 'receita' | 'despesa_cartao' | 'transferencia') => {
    setDialogType(type)
    setDialogOpen(true)
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <div className="from-primary/5 to-card bg-gradient-to-t dark:bg-card flex h-full w-full flex-col">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">Financeiro</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full" size="sm">
                  <IconPlus className="mr-2 h-4 w-4" />
                  Adicionar Transação
                  <IconChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={4} className="w-[15rem] bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-zinc-800 dark:border-zinc-200">
                <DropdownMenuItem onClick={() => handleTransactionClick('despesa')}>
                  <IconTrendingDown className="mr-2 h-4 w-4" />
                  Despesa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTransactionClick('receita')}>
                  <IconTrendingUp className="mr-2 h-4 w-4" />
                  Receita
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTransactionClick('despesa_cartao')}>
                  <IconCreditCardPay className="mr-2 h-4 w-4" />
                  Despesa cartão
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTransactionClick('transferencia')}>
                  <IconTransfer className="mr-2 h-4 w-4" />
                  Transferência
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </div>
      
      <TransactionDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        type={dialogType}
      />
    </Sidebar>
  )
}

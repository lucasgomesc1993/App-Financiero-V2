"use client"
import { useId, useMemo, useState } from "react"
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  RowData,
  SortingState,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDownIcon, ChevronUpIcon, SearchIcon, TrendingUpIcon, TrendingDownIcon, ArrowRightLeftIcon, FileTextIcon, CreditCardIcon, BuildingIcon, MoreHorizontalIcon, EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, CircleAlertIcon, LandmarkIcon, GlobeIcon } from 'lucide-react'
import { IconCreditCardPay, IconTransfer } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select"
  }
}

type TransactionType = "receita" | "despesa" | "transferencia" | "fatura"
type OriginType = "cartao" | "conta"

type Transaction = {
  id: string
  tipo: TransactionType
  descricao: string
  categoria: string
  origem: OriginType
  origemNome: string
  data: Date
  valor: number
}

const typeIcons = {
  receita: TrendingUpIcon,
  despesa: TrendingDownIcon,
  transferencia: IconTransfer,
  fatura: IconCreditCardPay,
}

const typeLabels = {
  receita: "Receita",
  despesa: "Despesa",
  transferencia: "Transferência",
  fatura: "Pagamento de Fatura",
}

const originIcons = {
  cartao: CreditCardIcon,
  conta: LandmarkIcon,
}

const originLabels = {
  cartao: "Cartão de Crédito",
  conta: "Conta Bancária",
}

const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
  },
  {
    header: () => (
      <div className="flex items-center justify-center">
        Tipo
      </div>
    ),
    accessorKey: "tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as TransactionType
      const Icon = typeIcons[tipo]
      const colors = {
        receita: "text-green-600 dark:text-green-400",
        despesa: "text-red-600 dark:text-red-400",
        transferencia: "text-blue-600 dark:text-blue-400",
        fatura: "text-purple-600 dark:text-purple-400",
      }
      
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("flex items-center justify-center", colors[tipo], "cursor-pointer")}>
                <Icon size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              {typeLabels[tipo]}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    meta: {
      filterVariant: "select",
    },
    filterHeader: "Transações",
    enableSorting: false,
  },
  {
    header: "Descrição",
    accessorKey: "descricao",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("descricao")}</div>
    ),
  },
  {
    header: "Categoria",
    accessorKey: "categoria",
    cell: ({ row }) => {
      const categoria = row.getValue("categoria") as string
      
      // Cores para diferentes categorias (light e dark theme)
      const categoryColors: Record<string, string> = {
        "Trabalho": "border-green-300 text-green-700 bg-green-50 dark:border-green-600 dark:text-green-200 dark:bg-green-900/30",
        "Alimentação": "border-orange-300 text-orange-700 bg-orange-50 dark:border-orange-600 dark:text-orange-200 dark:bg-orange-900/30",
        "Transporte": "border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-600 dark:text-blue-200 dark:bg-blue-900/30",
        "Saúde": "border-red-300 text-red-700 bg-red-50 dark:border-red-600 dark:text-red-200 dark:bg-red-900/30",
        "Entretenimento": "border-purple-300 text-purple-700 bg-purple-50 dark:border-purple-600 dark:text-purple-200 dark:bg-purple-900/30",
        "Investimento": "border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-600 dark:text-blue-200 dark:bg-blue-900/30", // Azul como transferência
        "Cartão de Crédito": "border-purple-300 text-purple-700 bg-purple-50 dark:border-purple-600 dark:text-purple-200 dark:bg-purple-900/30", // Roxo como fatura
        "Utilidades": "border-yellow-300 text-yellow-700 bg-yellow-50 dark:border-yellow-600 dark:text-yellow-200 dark:bg-yellow-900/30",
        "Pessoal": "border-pink-300 text-pink-700 bg-pink-50 dark:border-pink-600 dark:text-pink-200 dark:bg-pink-900/30",
      }
      
      const colorClass = categoryColors[categoria] || "border-gray-300 text-gray-700 bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800/50"
      
      return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs", colorClass)}>
          {categoria}
        </div>
      )
    },
    meta: {
      filterVariant: "select",
    },
  },
  {
    header: () => (
      <div className="flex items-center justify-center">
        Origem
      </div>
    ),
    accessorKey: "origem",
    cell: ({ row }) => {
      const origem = row.getValue("origem") as OriginType
      const origemNome = row.original.origemNome
      const Icon = originIcons[origem]
      
      // Define constants locally to ensure they're accessible
      const localOriginLabels = {
        cartao: "Cartão de Crédito",
        conta: "Conta Bancária",
      }
      
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Icon size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              {localOriginLabels[origem]}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    meta: {
      filterVariant: "select",
    },
    filterHeader: "Origem",
    enableSorting: false,
  },
  {
    header: "Data",
    accessorKey: "data",
    cell: ({ row }) => {
      const data = row.getValue("data") as Date
      return (
        <div className="text-sm">
          {data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          })}
        </div>
      )
    },
  },
  {
    header: "Valor",
    accessorKey: "valor",
    cell: ({ row }) => {
      const valor = row.getValue("valor") as number
      const tipo = row.getValue("tipo") as TransactionType
      
      const colors = {
        receita: "text-green-600 dark:text-green-400",
        despesa: "text-red-600 dark:text-red-400",
        transferencia: "text-blue-600 dark:text-blue-400",
        fatura: "text-purple-600 dark:text-purple-400",
      }
      
      const prefix = tipo === "despesa" ? "-" : tipo === "receita" ? "+" : ""
      
      return (
        <div className={cn("font-medium", colors[tipo])}>
          {prefix}R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      )
    },
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Ações",
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                alert(`Editar transação: ${transaction.descricao}`)
              }}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DeleteTransactionDialog 
              transaction={transaction}
              onDelete={() => {
                alert(`Transação "${transaction.descricao}" excluída!`)
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
  },
]

// Component for delete confirmation dialog
function DeleteTransactionDialog({ 
  transaction, 
  onDelete 
}: { 
  transaction: Transaction
  onDelete: () => void 
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem 
          className="font-normal"
          onSelect={(e) => e.preventDefault()}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a transação "{transaction.descricao}"? Esta ação não pode ser desfeita.
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

// Component for bulk delete confirmation dialog
function BulkDeleteDialog({ 
  selectedCount, 
  onDelete 
}: { 
  selectedCount: number
  onDelete: () => void 
}) {
  const transactionText = selectedCount === 1 ? "transação" : "transações"
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 font-normal"
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Excluir ({selectedCount})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedCount} {transactionText}? Esta ação não pode ser desfeita.
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

const transactions: Transaction[] = [
  {
    id: "1",
    tipo: "receita",
    descricao: "Salário",
    categoria: "Trabalho",
    origem: "conta",
    origemNome: "Conta Corrente Santander",
    data: new Date(2024, 0, 25),
    valor: 5500.00,
  },
  {
    id: "2",
    tipo: "despesa",
    descricao: "Supermercado",
    categoria: "Alimentação",
    origem: "cartao",
    origemNome: "Cartão Nubank",
    data: new Date(2024, 0, 23),
    valor: 280.50,
  },
  {
    id: "3",
    tipo: "transferencia",
    descricao: "Transferência para poupança",
    categoria: "Investimento",
    origem: "conta",
    origemNome: "Conta Corrente Santander",
    data: new Date(2024, 0, 22),
    valor: 1000.00,
  },
  {
    id: "4",
    tipo: "fatura",
    descricao: "Fatura do cartão",
    categoria: "Cartão de Crédito",
    origem: "conta",
    origemNome: "Conta Corrente Santander",
    data: new Date(2024, 0, 20),
    valor: 1250.75,
  },
  {
    id: "5",
    tipo: "despesa",
    descricao: "Combustível",
    categoria: "Transporte",
    origem: "cartao",
    origemNome: "Cartão Itaú",
    data: new Date(2024, 0, 18),
    valor: 120.00,
  },
  {
    id: "6",
    tipo: "receita",
    descricao: "Freelance",
    categoria: "Trabalho",
    origem: "conta",
    origemNome: "Conta Poupança Caixa",
    data: new Date(2024, 0, 15),
    valor: 800.00,
  },
  {
    id: "7",
    tipo: "despesa",
    descricao: "Farmácia",
    categoria: "Saúde",
    origem: "cartao",
    origemNome: "Cartão Nubank",
    data: new Date(2024, 0, 12),
    valor: 85.30,
  },
  {
    id: "8",
    tipo: "transferencia",
    descricao: "PIX para amigo",
    categoria: "Pessoal",
    origem: "conta",
    origemNome: "Conta Corrente Santander",
    data: new Date(2024, 0, 10),
    valor: 200.00,
  },
  {
    id: "9",
    tipo: "despesa",
    descricao: "Netflix",
    categoria: "Entretenimento",
    origem: "cartao",
    origemNome: "Cartão Nubank",
    data: new Date(2024, 0, 8),
    valor: 45.90,
  },
  {
    id: "10",
    tipo: "receita",
    descricao: "Venda produto",
    categoria: "Trabalho",
    origem: "conta",
    origemNome: "Conta Corrente Santander",
    data: new Date(2024, 0, 5),
    valor: 350.00,
  },
  {
    id: "11",
    tipo: "despesa",
    descricao: "Almoço",
    categoria: "Alimentação",
    origem: "cartao",
    origemNome: "Cartão Itaú",
    data: new Date(2024, 0, 3),
    valor: 28.50,
  },
  {
    id: "12",
    tipo: "fatura",
    descricao: "Conta de luz",
    categoria: "Utilidades",
    origem: "conta",
    origemNome: "Conta Corrente Santander",
    data: new Date(2024, 0, 1),
    valor: 185.40,
  },
]

export default function FinancialTransactionsTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "data",
      desc: true,
    },
  ])
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    enableRowSelection: true,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Transações</CardTitle>
        <CardDescription>
          Gerencie suas transações financeiras com filtros e ações em lote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtros e Botão de Exclusão */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Filtro de Tipo */}
            <div className="flex-1 min-w-[140px]">
              <Filter column={table.getColumn("tipo")!} />
            </div>
            {/* Busca por Descrição */}
            <div className="flex-1 min-w-[140px]">
              <Filter column={table.getColumn("descricao")!} />
            </div>
            {/* Filtro de Categoria */}
            <div className="flex-1 min-w-[140px]">
              <Filter column={table.getColumn("categoria")!} />
            </div>
            {/* Filtro de Origem */}
            <div className="flex-1 min-w-[140px]">
              <Filter column={table.getColumn("origem")!} />
            </div>
            {/* Filtro de Valor */}
            <div className="flex-1 min-w-[140px]">
              <Filter column={table.getColumn("valor")!} />
            </div>
            
            {/* Botão de exclusão em lote - alinhado à direita */}
            {hasSelectedRows && (
              <div className="ml-auto">
                <BulkDeleteDialog 
                  selectedCount={selectedRows.length}
                  onDelete={() => {
                    alert(`${selectedRows.length} transação(ões) excluída(s)!`)
                    setRowSelection({})
                  }}
                />
              </div>
            )}
          </div>
          <div className="relative">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/50">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "relative h-10 border-t select-none",
                            header.column.id === "tipo" || header.column.id === "origem" 
                              ? "text-center p-2" 
                              : ""
                          )}
                          aria-sort={
                            header.column.getIsSorted() === "asc"
                              ? "ascending"
                              : header.column.getIsSorted() === "desc"
                                ? "descending"
                                : "none"
                          }
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <div
                              className={cn(
                                header.column.getCanSort() &&
                                  "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                              onKeyDown={(e) => {
                                if (
                                  header.column.getCanSort() &&
                                  (e.key === "Enter" || e.key === " ")
                                ) {
                                  e.preventDefault()
                                  header.column.getToggleSortingHandler()?.(e)
                                }
                              }}
                              tabIndex={header.column.getCanSort() ? 0 : undefined}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: (
                                  <ChevronUpIcon
                                    className="shrink-0 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                ),
                                desc: (
                                  <ChevronDownIcon
                                    className="shrink-0 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? (
                                <span className="size-4" aria-hidden="true" />
                              )}
                            </div>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id}
                          className={cn(
                            cell.column.id === "tipo" || cell.column.id === "origem" 
                              ? "text-center p-2" 
                              : ""
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Paginação */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 border-t">
            {/* Container principal para mobile - tudo em uma linha */}
            <div className="flex items-center justify-between w-full sm:hidden">
              {/* Informação da página */}
              <div className="text-sm font-medium">
                {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </div>
              
              {/* Controles direita */}
              <div className="flex items-center space-x-2">
                {/* Linhas por página */}
                <div className="flex items-center space-x-1">
                  <p className="text-xs font-medium">Por pág.</p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger className="h-7 w-[60px] text-xs">
                      <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Navegação */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Ir para página anterior</span>
                    <ChevronLeftIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Ir para próxima página</span>
                    <ChevronRightIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Layout para desktop - mantido como antes */}
            <div className="hidden sm:flex items-center justify-between w-full">
              {/* Linhas por página */}
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Linhas por página</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Informação da página */}
              <div className="flex items-center justify-center text-sm font-medium">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </div>
              
              {/* Controles de navegação */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 hidden lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir para primeira página</span>
                  <ChevronsLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir para página anterior</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir para próxima página</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 hidden lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir para última página</span>
                  <ChevronsRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const id = useId()
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnHeader = (column.columnDef as any).filterHeader || 
    (typeof column.columnDef.header === "string" ? column.columnDef.header : "")
  
  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === "range") return []
    const values = Array.from(column.getFacetedUniqueValues().keys())
    return values.sort()
  }, [column.getFacetedUniqueValues(), filterVariant])

  // Mapear valores para labels mais amigáveis
  const getDisplayValue = (value: string) => {
    if (column.id === "tipo") {
      const localTypeLabels = {
        receita: "Receita",
        despesa: "Despesa",
        transferencia: "Transferência",
        fatura: "Pagamento de Fatura",
      }
      return localTypeLabels[value as TransactionType] || value
    }
    if (column.id === "origem") {
      const localOriginLabels = {
        cartao: "Cartão de Crédito",
        conta: "Conta Bancária",
      }
      return localOriginLabels[value as OriginType] || value
    }
    return value
  }

  if (filterVariant === "range") {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">{columnHeader}</Label>
        <div className="flex gap-1">
          <Input
            id={`${id}-range-1`}
            className="flex-1 rounded-r-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder="Min"
            type="number"
            aria-label={`${columnHeader} mínimo`}
          />
          <Input
            id={`${id}-range-2`}
            className="flex-1 rounded-l-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
            placeholder="Max"
            type="number"
            aria-label={`${columnHeader} máximo`}
          />
        </div>
      </div>
    )
  }

  if (filterVariant === "select") {
    return (
      <div className="space-y-3">
        <Label htmlFor={`${id}-select`} className="text-sm font-medium">{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? "all"}
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value)
          }}
        >
          <SelectTrigger id={`${id}-select`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                {getDisplayValue(String(value))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={`${id}-input`} className="text-sm font-medium">{columnHeader}</Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer ps-9"
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Buscar ${columnHeader.toLowerCase()}`}
          type="text"
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  )
}
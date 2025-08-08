// Tipos para o sistema de gráficos financeiros

/**
 * Períodos de tempo disponíveis para o gráfico
 */
export type TimePeriod = 
  | 'today'           // Hoje
  | 'yesterday'       // Ontem
  | 'last_7_days'     // Últimos 7 dias
  | 'last_15_days'    // Últimos 15 dias
  | 'last_30_days'    // Últimos 30 dias
  | 'this_week'       // Esta semana
  | 'last_week'       // Semana passada
  | 'this_month'      // Este mês
  | 'last_month'      // Mês passado
  | 'last_90_days'    // Últimos 90 dias
  | 'last_year'       // Último ano

/**
 * Formas de agrupamento de dados
 */
export type DataGrouping = 'daily' | 'weekly' | 'monthly'

/**
 * Interface para um ponto de dados do gráfico
 */
export interface ChartDataPoint {
  date: Date
  revenue: number
  expenses: number
}

/**
 * Interface para configuração completa do gráfico
 */
export interface ChartConfig {
  period: TimePeriod
  grouping: DataGrouping
  dataPoints: ChartDataPoint[]
  dateRange: {
    start: Date
    end: Date
  }
}

/**
 * Interface para opções de formatação
 */
export interface FormattingOptions {
  locale: string
  currency: string
  showYear: boolean
  abbreviateMonth: boolean
}

/**
 * Interface para informações de período formatado
 */
export interface FormattedPeriodInfo {
  label: string
  shortLabel: string
  grouping: DataGrouping
}

/**
 * Interface para dados agrupados
 */
export interface GroupedData {
  period: string
  revenue: number
  expenses: number
  count: number
}

/**
 * Mapeamento de períodos para configurações
 */
export interface PeriodConfig {
  label: string
  grouping: DataGrouping
  defaultDays: number
}

/**
 * Configurações pré-definidas para cada período
 */
export const PERIOD_CONFIGS: Record<TimePeriod, PeriodConfig> = {
  today: {
    label: 'Hoje',
    grouping: 'daily',
    defaultDays: 1
  },
  yesterday: {
    label: 'Ontem',
    grouping: 'daily',
    defaultDays: 1
  },
  last_7_days: {
    label: 'Últimos 7 dias',
    grouping: 'daily',
    defaultDays: 7
  },
  last_15_days: {
    label: 'Últimos 15 dias',
    grouping: 'daily',
    defaultDays: 15
  },
  last_30_days: {
    label: 'Últimos 30 dias',
    grouping: 'weekly',
    defaultDays: 30
  },
  this_week: {
    label: 'Esta semana',
    grouping: 'weekly',
    defaultDays: 7
  },
  last_week: {
    label: 'Semana passada',
    grouping: 'weekly',
    defaultDays: 7
  },
  this_month: {
    label: 'Este mês',
    grouping: 'weekly',
    defaultDays: 30
  },
  last_month: {
    label: 'Mês passado',
    grouping: 'weekly',
    defaultDays: 30
  },
  last_90_days: {
    label: 'Últimos 90 dias',
    grouping: 'monthly',
    defaultDays: 90
  },
  last_year: {
    label: 'Último ano',
    grouping: 'monthly',
    defaultDays: 365
  }
}

/**
 * Opções de formatação padrão para o Brasil
 */
export const DEFAULT_FORMATTING_OPTIONS: FormattingOptions = {
  locale: 'pt-BR',
  currency: 'BRL',
  showYear: true,
  abbreviateMonth: true
}

/**
 * Lista de períodos disponíveis para seleção
 */
export const AVAILABLE_PERIODS: TimePeriod[] = [
  'today',
  'yesterday',
  'last_7_days',
  'last_15_days',
  'last_30_days',
  'this_week',
  'last_week',
  'this_month',
  'last_month',
  'last_90_days',
  'last_year'
]
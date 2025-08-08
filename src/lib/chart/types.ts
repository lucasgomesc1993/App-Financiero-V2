// Tipos para o gráfico de fluxo de caixa

export type PeriodoTempo = 
  | 'hoje'
  | 'ontem'
  | 'ultimos_7_dias'
  | 'ultimos_15_dias'
  | 'ultimos_30_dias'
  | 'esta_semana'
  | 'semana_passada'
  | 'este_mes'
  | 'mes_passado'
  | 'ultimos_90_dias'
  | 'ultimo_ano'

export tipo AgrupamentoDados = 'diario' | 'semanal' | 'mensal'

export interface PontoDadosGrafico {
  data: Date
  receitas: number
  despesas: number
}

export interface ConfiguracaoGrafico {
  periodo: PeriodoTempo
  agrupamento: AgrupamentoDados
  pontosDados: PontoDadosGrafico[]
}

export interface IntervaloDatas {
  inicio: Date
  fim: Date
}

export interface OpcoesPeriodo {
  valor: PeriodoTempo
  label: string
  grupo?: string
}

// Formato para os dados brutos (vindo do banco ou API)
export interface DadosFinanceirosBrutos {
  data: string // formato ISO
  receitas: number
  despesas: number
}
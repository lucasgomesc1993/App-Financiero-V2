import { 
  DataGrouping, 
  FormattingOptions, 
  DEFAULT_FORMATTING_OPTIONS,
  FormattedPeriodInfo 
} from './types'
import { DateUtils } from '@/lib/utils/date-utils'

/**
 * Interface para formatter de eixo X
 */
export interface XAxisFormatter {
  format(date: Date, grouping: DataGrouping): string
}

/**
 * Interface para formatter de tooltip
 */
export interface TooltipFormatter {
  formatLabel(date: Date, grouping: DataGrouping): string
  formatValue(value: number): string
}

/**
 * Formatter para datas em português brasileiro
 */
export class BrazilianDateFormatter implements XAxisFormatter, TooltipFormatter {
  private options: FormattingOptions

  constructor(options: Partial<FormattingOptions> = {}) {
    this.options = { ...DEFAULT_FORMATTING_OPTIONS, ...options }
  }

  /**
   * Formata data para o eixo X
   */
  format(date: Date, grouping: DataGrouping): string {
    switch (grouping) {
      case 'daily':
        return this.formatDaily(date)
      case 'weekly':
        return this.formatWeekly(date)
      case 'monthly':
        return this.formatMonthly(date)
      default:
        return this.formatDaily(date)
    }
  }

  /**
   * Formata label para tooltip
   */
  formatLabel(date: Date, grouping: DataGrouping): string {
    switch (grouping) {
      case 'daily':
        return this.formatTooltipDaily(date)
      case 'weekly':
        return this.formatTooltipWeekly(date)
      case 'monthly':
        return this.formatTooltipMonthly(date)
      default:
        return this.formatTooltipDaily(date)
    }
  }

  /**
   * Formata valor monetário
   */
  formatValue(value: number): string {
    return new Intl.NumberFormat(this.options.locale, {
      style: 'currency',
      currency: this.options.currency
    }).format(value)
  }

  /**
   * Formata data diária para eixo X
   */
  private formatDaily(date: Date): string {
    return date.toLocaleDateString(this.options.locale, {
      day: 'numeric',
      month: this.options.abbreviateMonth ? 'short' : 'long'
    })
  }

  /**
   * Formata data semanal para eixo X
   */
  private formatWeekly(date: Date): string {
    const weekNumber = DateUtils.getWeekNumber(date)
    return `Sem ${weekNumber}`
  }

  /**
   * Formata data mensal para eixo X
   */
  private formatMonthly(date: Date): string {
    return date.toLocaleDateString(this.options.locale, {
      month: this.options.abbreviateMonth ? 'short' : 'long',
      year: this.options.showYear ? 'numeric' : undefined
    })
  }

  /**
   * Formata data diária para tooltip
   */
  private formatTooltipDaily(date: Date): string {
    return date.toLocaleDateString(this.options.locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  /**
   * Formata data semanal para tooltip
   */
  private formatTooltipWeekly(date: Date): string {
    const weekStart = DateUtils.startOfWeek(date)
    const weekEnd = DateUtils.endOfWeek(date)
    
    const startStr = weekStart.toLocaleDateString(this.options.locale, {
      day: 'numeric',
      month: 'short'
    })
    
    const endStr = weekEnd.toLocaleDateString(this.options.locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
    
    return `Semana ${DateUtils.getWeekNumber(date)} (${startStr} - ${endStr})`
  }

  /**
   * Formata data mensal para tooltip
   */
  private formatTooltipMonthly(date: Date): string {
    return date.toLocaleDateString(this.options.locale, {
      month: 'long',
      year: 'numeric'
    })
  }
}

/**
 * Factory para criar formatters
 */
export class FormatterFactory {
  /**
   * Cria um formatter para o eixo X
   */
  static createXAxisFormatter(locale: string = 'pt-BR'): XAxisFormatter {
    return new BrazilianDateFormatter({ locale })
  }

  /**
   * Cria um formatter para tooltip
   */
  static createTooltipFormatter(locale: string = 'pt-BR', currency: string = 'BRL'): TooltipFormatter {
    return new BrazilianDateFormatter({ locale, currency })
  }

  /**
   * Cria um formatter para valores monetários
   */
  static createCurrencyFormatter(locale: string = 'pt-BR', currency: string = 'BRL'): (value: number) => string {
    return (value: number) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(value)
    }
  }
}

/**
 * Utilitário para formatação de períodos
 */
export class PeriodFormatter {
  /**
   * Formata informações do período para exibição
   */
  static formatPeriodInfo(period: string, grouping: DataGrouping): FormattedPeriodInfo {
    const baseLabel = this.getBaseLabel(period)
    const shortLabel = this.getShortLabel(period, grouping)
    
    return {
      label: baseLabel,
      shortLabel,
      grouping
    }
  }

  /**
   * Retorna label base para o período
   */
  private static getBaseLabel(period: string): string {
    // Mapear períodos antigos para novos formatos
    const periodMap: Record<string, string> = {
      'hoje': 'Hoje',
      'ontem': 'Ontem',
      'ultimos_7_dias': 'Últimos 7 dias',
      'ultimos_15_dias': 'Últimos 15 dias',
      'ultimos_30_dias': 'Últimos 30 dias',
      'essa_semana': 'Esta semana',
      'semana_passada': 'Semana passada',
      'este_mes': 'Este mês',
      'mes_passado': 'Mês passado',
      'ultimos_90_dias': 'Últimos 90 dias',
      'ultimo_ano': 'Último ano'
    }
    
    return periodMap[period] || period
  }

  /**
   * Retorna label curto baseado no agrupamento
   */
  private static getShortLabel(period: string, grouping: DataGrouping): string {
    if (grouping === 'daily') {
      return 'Diário'
    } else if (grouping === 'weekly') {
      return 'Semanal'
    } else {
      return 'Mensal'
    }
  }
}

/**
 * Formatter para compatibilidade com código legado
 * Esta classe ajuda na migração gradual do sistema antigo para o novo
 */
export class LegacyFormatter {
  /**
   * Converte formato de período antigo para novo
   */
  static convertPeriodFormat(oldPeriod: string): string {
    const conversionMap: Record<string, string> = {
      'hoje': 'today',
      'ontem': 'yesterday',
      'ultimos_7_dias': 'last_7_days',
      'ultimos_15_dias': 'last_15_days',
      'ultimos_30_dias': 'last_30_days',
      'essa_semana': 'this_week',
      'semana_passada': 'last_week',
      'este_mes': 'this_month',
      'mes_passado': 'last_month',
      'ultimos_90_dias': 'last_90_days',
      'ultimo_ano': 'last_year'
    }
    
    return conversionMap[oldPeriod] || 'last_30_days'
  }

  /**
   * Formata eixo X no formato legado
   */
  static formatLegacyXAxis(value: string, timeRange: string): string {
    const newPeriod = this.convertPeriodFormat(timeRange)
    const formatter = FormatterFactory.createXAxisFormatter()
    
    if (['last_90_days', 'last_year'].includes(newPeriod)) {
      return value // Já está formatado como mês
    }
    
    if (['last_30_days', 'this_week', 'last_week', 'this_month', 'last_month'].includes(newPeriod)) {
      return value // Já está formatado como semana
    }
    
    const date = new Date(value)
    return formatter.format(date, 'daily')
  }
}
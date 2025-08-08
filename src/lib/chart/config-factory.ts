import { 
  TimePeriod, 
  ChartConfig, 
  ChartDataPoint, 
  DataGrouping,
  PERIOD_CONFIGS,
  PeriodConfig 
} from './types'
import { DateUtils, DateRange } from '@/lib/utils/date-utils'

/**
 * Classe responsável por criar configurações de gráfico
 * baseado no período selecionado
 */
export class ChartConfigFactory {
  /**
   * Cria uma configuração completa do gráfico para um período
   */
  static create(period: TimePeriod): ChartConfig {
    const periodConfig = PERIOD_CONFIGS[period]
    const dateRange = this.calculateDateRange(period)
    const dataPoints = this.generateDataPoints(dateRange, periodConfig.grouping)
    
    return {
      period,
      grouping: periodConfig.grouping,
      dataPoints,
      dateRange
    }
  }

  /**
   * Calcula o intervalo de datas para um período específico
   */
  private static calculateDateRange(period: TimePeriod): DateRange {
    const now = new Date()
    const today = DateUtils.startOfDay(now)
    
    switch (period) {
      case 'today':
        return {
          start: today,
          end: DateUtils.endOfDay(today)
        }
        
      case 'yesterday':
        const yesterday = DateUtils.subtractDays(today, 1)
        return {
          start: yesterday,
          end: DateUtils.endOfDay(yesterday)
        }
        
      case 'last_7_days':
        return {
          start: DateUtils.subtractDays(today, 6),
          end: today
        }
        
      case 'last_15_days':
        return {
          start: DateUtils.subtractDays(today, 14),
          end: today
        }
        
      case 'last_30_days':
        return {
          start: DateUtils.subtractDays(today, 29),
          end: today
        }
        
      case 'this_week':
        return {
          start: DateUtils.startOfWeek(today),
          end: DateUtils.endOfWeek(today)
        }
        
      case 'last_week':
        const lastWeekStart = DateUtils.subtractDays(DateUtils.startOfWeek(today), 7)
        const lastWeekEnd = DateUtils.subtractDays(DateUtils.endOfWeek(today), 7)
        return {
          start: lastWeekStart,
          end: lastWeekEnd
        }
        
      case 'this_month':
        return {
          start: DateUtils.startOfMonth(today),
          end: DateUtils.endOfMonth(today)
        }
        
      case 'last_month':
        const lastMonthStart = DateUtils.startOfMonth(DateUtils.subtractMonths(today, 1))
        const lastMonthEnd = DateUtils.endOfMonth(DateUtils.subtractMonths(today, 1))
        return {
          start: lastMonthStart,
          end: lastMonthEnd
        }
        
      case 'last_90_days':
        return {
          start: DateUtils.subtractDays(today, 89),
          end: today
        }
        
      case 'last_year':
        return {
          start: DateUtils.subtractMonths(today, 12),
          end: today
        }
        
      default:
        return {
          start: DateUtils.subtractDays(today, 29),
          end: today
        }
    }
  }

  /**
   * Gera pontos de dados para o gráfico
   */
  private static generateDataPoints(dateRange: DateRange, grouping: DataGrouping): ChartDataPoint[] {
    const allDates = DateUtils.getDateRange(dateRange.start, dateRange.end)
    
    if (grouping === 'daily') {
      return allDates.map(date => ({
        date,
        revenue: this.generateRealisticRevenue(date),
        expenses: this.generateRealisticExpenses(date)
      }))
    }
    
    if (grouping === 'weekly') {
      return this.generateWeeklyData(allDates)
    }
    
    if (grouping === 'monthly') {
      return this.generateMonthlyData(allDates)
    }
    
    return []
  }

  /**
   * Gera dados agrupados por semana
   */
  private static generateWeeklyData(dates: Date[]): ChartDataPoint[] {
    const weekGroups = DateUtils.groupByWeek(dates)
    const result: ChartDataPoint[] = []
    
    weekGroups.forEach((weekDates, weekStart) => {
      const weekStartObj = DateUtils.fromISOString(weekStart)
      const weekNumber = DateUtils.getWeekNumber(weekStartObj)
      
      const totalRevenue = weekDates.reduce((sum, date) => sum + this.generateRealisticRevenue(date), 0)
      const totalExpenses = weekDates.reduce((sum, date) => sum + this.generateRealisticExpenses(date), 0)
      
      result.push({
        date: weekStartObj,
        revenue: Math.round(totalRevenue / weekDates.length),
        expenses: Math.round(totalExpenses / weekDates.length)
      })
    })
    
    return result.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  /**
   * Gera dados agrupados por mês
   */
  private static generateMonthlyData(dates: Date[]): ChartDataPoint[] {
    const monthGroups = DateUtils.groupByMonth(dates)
    const result: ChartDataPoint[] = []
    
    monthGroups.forEach((monthDates, monthKey) => {
      const [year, month] = monthKey.split('-').map(Number)
      const monthDate = new Date(year, month - 1, 1)
      
      const totalRevenue = monthDates.reduce((sum, date) => sum + this.generateRealisticRevenue(date), 0)
      const totalExpenses = monthDates.reduce((sum, date) => sum + this.generateRealisticExpenses(date), 0)
      
      result.push({
        date: monthDate,
        revenue: Math.round(totalRevenue / monthDates.length),
        expenses: Math.round(totalExpenses / monthDates.length)
      })
    })
    
    return result.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  /**
   * Gera um valor realista de receita para uma data
   */
  private static generateRealisticRevenue(date: Date): number {
    const baseRevenue = 5000 + Math.random() * 4000 // 5000-9000
    
    // Variação por dia da semana
    const dayOfWeek = date.getDay()
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1
    
    // Variação sazonal por mês
    const monthMultiplier = 1 + (date.getMonth() % 3) * 0.1
    
    return Math.round(baseRevenue * weekendMultiplier * monthMultiplier)
  }

  /**
   * Gera um valor realista de despesas para uma data
   */
  private static generateRealisticExpenses(date: Date): number {
    const baseExpenses = 3000 + Math.random() * 3000 // 3000-6000
    
    // Variação por dia da semana
    const dayOfWeek = date.getDay()
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1
    
    // Variação sazonal por mês
    const monthMultiplier = 1 + (date.getMonth() % 3) * 0.05
    
    return Math.round(baseExpenses * weekendMultiplier * monthMultiplier)
  }

  /**
   * Obtém o período padrão baseado no tamanho da tela
   */
  static getDefaultPeriod(isMobile: boolean): TimePeriod {
    return isMobile ? 'last_7_days' : 'last_30_days'
  }

  /**
   * Verifica se um período requer agrupamento de dados
   */
  static requiresGrouping(period: TimePeriod): boolean {
    const config = PERIOD_CONFIGS[period]
    return config.grouping !== 'daily'
  }

  /**
   * Retorna a label formatada para um período
   */
  static getPeriodLabel(period: TimePeriod): string {
    return PERIOD_CONFIGS[period].label
  }

  /**
   * Retorna todas as configurações de período disponíveis
   */
  static getAllPeriodConfigs(): Array<{ value: TimePeriod; label: string }> {
    return Object.entries(PERIOD_CONFIGS).map(([value, config]) => ({
      value: value as TimePeriod,
      label: config.label
    }))
  }
}
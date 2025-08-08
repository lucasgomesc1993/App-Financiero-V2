// Utilitários para manipulação de datas

/**
 * Interface para intervalo de datas
 */
export interface DateRange {
  start: Date
  end: Date
}

/**
 * Classe utilitária para operações com datas
 */
export class DateUtils {
  /**
   * Cria uma nova data com hora zerada
   */
  static startOfDay(date: Date): Date {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  }

  /**
   * Cria uma nova data com fim do dia
   */
  static endOfDay(date: Date): Date {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
  }

  /**
   * Retorna o início da semana (domingo)
   */
  static startOfWeek(date: Date): Date {
    const result = new Date(date)
    const day = result.getDay()
    result.setDate(result.getDate() - day)
    return this.startOfDay(result)
  }

  /**
   * Retorna o fim da semana (sábado)
   */
  static endOfWeek(date: Date): Date {
    const result = new Date(date)
    const day = result.getDay()
    result.setDate(result.getDate() + (6 - day))
    return this.endOfDay(result)
  }

  /**
   * Retorna o início do mês
   */
  static startOfMonth(date: Date): Date {
    const result = new Date(date)
    result.setDate(1)
    return this.startOfDay(result)
  }

  /**
   * Retorna o fim do mês
   */
  static endOfMonth(date: Date): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + 1)
    result.setDate(0)
    return this.endOfDay(result)
  }

  /**
   * Adiciona dias a uma data
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  /**
   * Subtrai dias de uma data
   */
  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days)
  }

  /**
   * Adiciona meses a uma data
   */
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  }

  /**
   * Subtrai meses de uma data
   */
  static subtractMonths(date: Date, months: number): Date {
    return this.addMonths(date, -months)
  }

  /**
   * Calcula o número da semana no ano
   */
  static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  /**
   * Verifica se duas datas são o mesmo dia
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  /**
   * Verifica se uma data está dentro de um intervalo
   */
  static isInRange(date: Date, range: DateRange): boolean {
    return date >= range.start && date <= range.end
  }

  /**
   * Retorna a diferença em dias entre duas datas
   */
  static daysDifference(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime())
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  /**
   * Formata data em string ISO sem timezone
   */
  static toISOString(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  /**
   * Cria uma data a partir de string ISO
   */
  static fromISOString(isoString: string): Date {
    return new Date(isoString + 'T00:00:00')
  }

  /**
   * Retorna um array de datas entre duas datas
   */
  static getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = []
    const current = new Date(start)
    
    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  }

  /**
   * Agrupa datas por semana
   */
  static groupByWeek(dates: Date[]): Map<string, Date[]> {
    const groups = new Map<string, Date[]>()
    
    dates.forEach(date => {
      const weekStart = this.startOfWeek(date)
      const weekKey = this.toISOString(weekStart)
      
      if (!groups.has(weekKey)) {
        groups.set(weekKey, [])
      }
      groups.get(weekKey)!.push(date)
    })
    
    return groups
  }

  /**
   * Agrupa datas por mês
   */
  static groupByMonth(dates: Date[]): Map<string, Date[]> {
    const groups = new Map<string, Date[]>()
    
    dates.forEach(date => {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!groups.has(monthKey)) {
        groups.set(monthKey, [])
      }
      groups.get(monthKey)!.push(date)
    })
    
    return groups
  }
}
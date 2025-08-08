// Utilitários para manipulação de datas

export class DateUtils {
  /**
   * Retorna o início do dia (00:00:00)
   */
  static inicioDoDia(data: Date): Date {
    const resultado = new Date(data)
    resultado.setHours(0, 0, 0, 0)
    return resultado
  }

  /**
   * Retorna o fim do dia (23:59:59)
   */
  static fimDoDia(data: Date): Date {
    const resultado = new Date(data)
    resultado.setHours(23, 59, 59, 999)
    return resultado
  }

  /**
   * Retorna o início da semana (domingo)
   */
  static inicioDaSemana(data: Date): Date {
    const resultado = new Date(data)
    const diaSemana = resultado.getDay()
    resultado.setDate(data.getDate() - diaSemana)
    return this.inicioDoDia(resultado)
  }

  /**
   * Retorna o fim da semana (sábado)
   */
  static fimDaSemana(data: Date): Date {
    const resultado = new Date(data)
    const diaSemana = resultado.getDay()
    resultado.setDate(data.getDate() + (6 - diaSemana))
    return this.fimDoDia(resultado)
  }

  /**
   * Retorna o início do mês
   */
  static inicioDoMes(data: Date): Date {
    const resultado = new Date(data)
    resultado.setDate(1)
    return this.inicioDoDia(resultado)
  }

  /**
   * Retorna o fim do mês
   */
  static fimDoMes(data: Date): Date {
    const resultado = new Date(data)
    resultado.setMonth(resultado.getMonth() + 1, 0)
    return this.fimDoDia(resultado)
  }

  /**
   * Retorna o número da semana no mês
   */
  static numeroSemanaNoMes(data: Date): number {
    const inicioMes = this.inicioDoMes(data)
    const diasPassados = Math.floor((data.getTime() - inicioMes.getTime()) / (24 * 60 * 60 * 1000))
    return Math.ceil((diasPassados + inicioMes.getDay() + 1) / 7)
  }

  /**
   * Formata data no padrão brasileiro
   */
  static formatarBrasil(data: Date, opcoes?: Intl.DateTimeFormatOptions): string {
    const opcoesPadrao: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...opcoes
    }
    return data.toLocaleDateString('pt-BR', opcoesPadrao)
  }

  /**
   * Verifica se uma data está dentro de um intervalo
   */
  static estaNoIntervalo(data: Date, inicio: Date, fim: Date): boolean {
    return data >= inicio && data <= fim
  }

  /**
   * Adiciona dias a uma data
   */
  static adicionarDias(data: Date, dias: number): Date {
    const resultado = new Date(data)
    resultado.setDate(data.getDate() + dias)
    return resultado
  }

  /**
   * Subtrai dias de uma data
   */
  static subtrairDias(data: Date, dias: number): Date {
    return this.adicionarDias(data, -dias)
  }

  /**
   * Adiciona meses a uma data
   */
  static adicionarMeses(data: Date, meses: number): Date {
    const resultado = new Date(data)
    resultado.setMonth(data.getMonth() + meses)
    return resultado
  }

  /**
   * Subtrai meses de uma data
   */
  static subtrairMeses(data: Date, meses: number): Date {
    return this.adicionarMeses(data, -meses)
  }
}
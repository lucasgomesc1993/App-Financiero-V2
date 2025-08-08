import { useState, useCallback } from 'react'

export function useCurrencyFormat(initialValue: string = '') {
  const [value, setValue] = useState(initialValue)

  const formatCurrency = useCallback((value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')
    
    // Se não tiver números, retorna vazio
    if (numbers.length === 0) return ''
    
    // Converte para número e formata
    const numberValue = parseInt(numbers) / 100
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
  }, [])

  const getFormattedValue = useCallback(() => {
    return formatCurrency(value)
  }, [value, formatCurrency])

  const getNumericValue = useCallback(() => {
    const numbers = value.replace(/\D/g, '')
    return numbers.length > 0 ? parseInt(numbers) / 100 : 0
  }, [value])

  const setValueDirect = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])

  return {
    value,
    formattedValue: getFormattedValue(),
    numericValue: getNumericValue(),
    handleChange,
    setValue: setValueDirect
  }
}
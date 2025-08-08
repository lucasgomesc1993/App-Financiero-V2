"use client"

import { useState, useCallback, useRef } from "react"

export function usePhoneFormat() {
  const [value, setValue] = useState("")
  const [isValid, setIsValid] = useState(false)
  const lastCursorPosition = useRef<number | null>(null)
  const lastValue = useRef("")

  const formatPhone = useCallback((phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, "")
    
    // Limita a 11 dígitos (formato brasileiro)
    const limited = cleaned.slice(0, 11)
    
    // Verifica se é um telefone válido (10 ou 11 dígitos, se tiver 11 dígitos o terceiro deve ser 9)
    const phoneValid = (limited.length === 10) || (limited.length === 11 && limited[2] === '9')
    setIsValid(phoneValid)
    
    // Aplica a formatação (XX) XXXX-XXXX para 10 dígitos ou (XX) XXXXX-XXXX para 11 dígitos
    if (limited.length <= 2) {
      return limited
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    } else if (limited.length === 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6, 10)}`
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`
    }
  }, [])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const newValue = input.value
    const cursorPosition = input.selectionStart
    
    // Detecta se o usuário está tentando apagar (backspace ou delete)
    const isDeleting = lastValue.current.length > newValue.length
    
    // Se estiver apagando e o novo valor contém apenas caracteres não numéricos
    // ou se está tentando apagar um caractere especial como hífen, parênteses ou espaço
    if (isDeleting) {
      const deletedChar = lastValue.current[cursorPosition - 1] || ''
      const isSpecialChar = /[()\- ]/.test(deletedChar)
      
      if (isSpecialChar) {
        // Se está apagando um caractere especial, remove o caractere anterior também
        const cleanedValue = newValue.replace(/\D/g, "")
        const formatted = formatPhone(cleanedValue)
        setValue(formatted)
        lastValue.current = formatted
        
        // Posiciona o cursor após o caractere especial removido
        setTimeout(() => {
          const newCursorPosition = Math.max(0, cursorPosition - 1)
          input.setSelectionRange(newCursorPosition, newCursorPosition)
        }, 0)
        return
      }
    }
    
    // Para casos normais de digitação
    const formatted = formatPhone(newValue)
    setValue(formatted)
    lastValue.current = formatted
    
    // Ajusta a posição do cursor para formatação normal
    if (!isDeleting) {
      setTimeout(() => {
        let newCursorPosition = cursorPosition
        
        // Ajusta baseado na diferença de comprimento
        const lengthDiff = formatted.length - newValue.length
        if (lengthDiff > 0) {
          newCursorPosition = Math.min(formatted.length, cursorPosition + lengthDiff)
        }
        
        input.setSelectionRange(newCursorPosition, newCursorPosition)
      }, 0)
    }
  }, [formatPhone])

  const getRawValue = useCallback(() => {
    return value.replace(/\D/g, "")
  }, [value])

  return {
    value,
    isValid,
    handleChange,
    getRawValue,
    setValue,
  }
}
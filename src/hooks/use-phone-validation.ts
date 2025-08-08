"use client"

import { useState, useCallback } from "react"

export function usePhoneValidation() {
  const [value, setValue] = useState("")
  const [isValid, setIsValid] = useState(false)

  const formatPhone = useCallback((phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, "")
    
    // Limita a 11 dígitos (formato brasileiro)
    const limited = cleaned.slice(0, 11)
    
    // Aplica a formatação (XX) XXXXX-XXXX
    if (limited.length <= 2) {
      return limited
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`
    }
  }, [])

  const validatePhone = useCallback((phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, "")
    // Verifica se tem exatamente 11 dígitos e começa com DDD válido
    return cleaned.length === 11 && /^\d{11}$/.test(cleaned)
  }, [])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const formatted = formatPhone(inputValue)
    setValue(formatted)
    setIsValid(validatePhone(formatted))
  }, [formatPhone, validatePhone])

  const getRawValue = useCallback(() => {
    return value.replace(/\D/g, "")
  }, [value])

  return {
    value,
    isValid,
    handleChange,
    getRawValue,
    setValue,
    validatePhone,
  }
}
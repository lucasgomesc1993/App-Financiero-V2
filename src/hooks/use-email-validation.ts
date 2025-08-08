"use client"

import { useState, useCallback, useEffect } from "react"

export function useEmailValidation(initialEmail: string = "") {
  const [value, setValue] = useState(initialEmail)
  const [isValid, setIsValid] = useState(false)

  // Regex para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateEmail = useCallback((email: string) => {
    return emailRegex.test(email)
  }, [])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value
    setValue(email)
    setIsValid(validateEmail(email))
  }, [validateEmail])

  // Initialize validation on mount
  useEffect(() => {
    setIsValid(validateEmail(initialEmail))
  }, [initialEmail, validateEmail])

  return {
    value,
    isValid,
    handleChange,
    setValue,
    validateEmail,
  }
}
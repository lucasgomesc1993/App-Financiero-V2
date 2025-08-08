"use client"

import { useState, useCallback } from "react"

interface UseCharacterLimitProps {
  maxLength: number
  initialValue?: string
}

export function useCharacterLimit({ maxLength, initialValue = "" }: UseCharacterLimitProps) {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newValue = event.target.value
      if (newValue.length <= maxLength) {
        setValue(newValue)
      }
    },
    [maxLength]
  )

  const characterCount = value.length

  return {
    value,
    characterCount,
    handleChange,
    maxLength,
  }
}
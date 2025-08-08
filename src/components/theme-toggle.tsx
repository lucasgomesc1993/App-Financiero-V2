"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenuItem onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? (
        <>
          <Moon className="mr-2 h-4 w-4" />
          <span>Tema Escuro</span>
        </>
      ) : (
        <>
          <Sun className="mr-2 h-4 w-4" />
          <span>Tema Claro</span>
        </>
      )}
    </DropdownMenuItem>
  )
}
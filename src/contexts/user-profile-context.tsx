"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface UserProfile {
  name: string
  email: string
  avatar: string | null
}

interface UserProfileContextType {
  userProfile: UserProfile
  updateUserProfile: (updates: Partial<UserProfile>) => void
  getInitials: () => string
}

const defaultUserProfile: UserProfile = {
  name: "shadcn",
  email: "m@example.com",
  avatar: null,
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }))
  }

  const getInitials = () => {
    if (!userProfile.name) return ""
    
    const names = userProfile.name.trim().split(" ")
    if (names.length === 0) return ""
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <UserProfileContext.Provider value={{
      userProfile,
      updateUserProfile,
      getInitials,
    }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
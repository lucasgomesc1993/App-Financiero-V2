"use client"

import {
  IconDotsVertical,
  IconLogout,
  IconUser,
} from "@tabler/icons-react"
import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUserProfile } from "@/contexts/user-profile-context"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const { userProfile, getInitials } = useUserProfile()

  const handleAccountClick = () => {
    setIsProfileDialogOpen(true)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={userProfile.avatar || undefined} alt={userProfile.name} />
                  <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userProfile.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userProfile.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userProfile.avatar || undefined} alt={userProfile.name} />
                    <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userProfile.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {userProfile.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleAccountClick}>
                  <IconUser className="mr-2 h-4 w-4" />
                  Conta
                </DropdownMenuItem>
                <ThemeToggle />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconLogout className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      
      <ProfileEditDialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen} />
    </>
  )
}

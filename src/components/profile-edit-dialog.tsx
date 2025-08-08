"use client"

import { useId, useState } from "react"
import { CheckIcon, ImagePlusIcon, XIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useEmailValidation } from "@/hooks/use-email-validation"
import { usePhoneFormat } from "@/hooks/use-phone-format"
import { useUserProfile } from "@/contexts/user-profile-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"





export function ProfileEditDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const id = useId()
  const { userProfile, updateUserProfile } = useUserProfile()
  
  const { value: phoneValue, isValid: isPhoneValid, handleChange: handlePhoneChange } = usePhoneFormat()
  const { value: emailValue, isValid: isEmailValid, handleChange: handleEmailChange } = useEmailValidation(userProfile.email)

  const handleSaveChanges = () => {
    // Validate fields before saving
    const errors = []
    
    if (!isEmailValid) {
      errors.push("Email")
    }
    
    if (!isPhoneValid) {
      errors.push("WhatsApp")
    }
    
    if (errors.length > 0) {
      // Show error message for invalid fields
      const errorMessage = errors.length === 1 
        ? `Campo ${errors[0]} preenchido incorretamente`
        : `Campos ${errors.join(" e ")} preenchidos incorretamente`
      
      toast.error(errorMessage, {
        description: "Por favor, corrija os campos para alterar corretamente",
        duration: 3000,
      })
      return // Don't close the dialog
    }
    
    // Update the user profile with the form values
    updateUserProfile({
      name: (document.getElementById(`${id}-full-name`) as HTMLInputElement)?.value || userProfile.name,
      email: emailValue || userProfile.email,
      // Note: Avatar image will be handled by the Avatar component
    })
    
    // Show success message
    toast.success("Perfil atualizado com sucesso!", {
      duration: 2000,
    })
    
    // Close the dialog after successful save
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Editar perfil
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Faça alterações no seu perfil aqui. Você pode alterar sua foto e definir
          nome, email e WhatsApp.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="flex items-center gap-4 px-6 pt-6 pb-4">
            <Avatar onUpdateAvatar={(avatarUrl) => updateUserProfile({ avatar: avatarUrl })} />
            <div className="flex-1">
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-full-name`}>Nome completo</Label>
                <Input
                  id={`${id}-full-name`}
                  placeholder="Seu nome completo"
                  defaultValue={userProfile.name}
                  type="text"
                  required
                />
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <form className="space-y-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <div className="relative">
                  <Input
                    id={`${id}-email`}
                    className="peer pe-9"
                    placeholder="seu.email@exemplo.com"
                    value={emailValue}
                    onChange={handleEmailChange}
                    type="email"
                    required
                  />
                  {isEmailValid && (
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                      <CheckIcon
                        size={16}
                        className="text-emerald-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-whatsapp`}>WhatsApp</Label>
                <div className="relative">
                  <Input
                    id={`${id}-whatsapp`}
                    className="peer pe-9"
                    placeholder="(11) 91234-5678"
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    type="tel"
                    required
                  />
                  {isPhoneValid && (
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                      <CheckIcon
                        size={16}
                        className="text-emerald-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              </div>
  
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveChanges}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


interface AvatarProps {
  onUpdateAvatar: (avatarUrl: string | null) => void
}

function Avatar({ onUpdateAvatar }: AvatarProps) {
  const { userProfile } = useUserProfile()
  const { files, openFileDialog, getInputProps } = useFileUpload({
    accept: "image/*",
    initialFiles: userProfile.avatar ? [{
      name: "profile-avatar.jpg",
      size: 1528737,
      type: "image/jpeg",
      url: userProfile.avatar,
      id: "profile-avatar-current",
    }] : [],
  })
  
  const currentImage = files[0]?.preview || null

  // Notify parent when avatar changes
  const handleFileChange = (newFiles: typeof files) => {
    if (newFiles.length > 0) {
      onUpdateAvatar(newFiles[0].preview)
    } else {
      onUpdateAvatar(null)
    }
  }

  return (
    <div className="flex-shrink-0">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <img
            src={currentImage}
            className="size-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={openFileDialog}
          aria-label="Change profile picture"
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload profile picture"
          onChange={(e) => {
            getInputProps().onChange(e)
            // Note: In a real implementation, you'd need to track file changes
            // This is a simplified version
            if (e.target.files && e.target.files[0]) {
              const reader = new FileReader()
              reader.onload = (event) => {
                if (event.target?.result) {
                  onUpdateAvatar(event.target.result as string)
                }
              }
              reader.readAsDataURL(e.target.files[0])
            }
          }}
        />
      </div>
    </div>
  )
}
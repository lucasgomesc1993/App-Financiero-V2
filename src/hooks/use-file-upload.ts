"use client"

import { useState, useCallback, useRef } from "react"

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  preview?: string
}

interface UseFileUploadProps {
  accept?: string
  multiple?: boolean
  initialFiles?: FileItem[]
}

export function useFileUpload({ 
  accept = "", 
  multiple = false, 
  initialFiles = [] 
}: UseFileUploadProps = {}) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const getInputProps = useCallback(() => ({
    type: "file",
    accept,
    multiple,
    ref: fileInputRef,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || [])
      
      const newFiles = selectedFiles.map((file, index) => {
        const id = `${file.name}-${Date.now()}-${index}`
        const preview = file.type.startsWith('image/') 
          ? URL.createObjectURL(file)
          : undefined
        
        return {
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: preview || '',
          preview,
        }
      })

      setFiles(prevFiles => {
        if (multiple) {
          return [...prevFiles, ...newFiles]
        } else {
          return newFiles
        }
      })

      // Reset input value to allow selecting the same file again
      event.target.value = ''
    },
  }), [accept, multiple])

  const removeFile = useCallback((id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(file => file.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prevFiles.filter(file => file.id !== id)
    })
  }, [])

  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }, [files])

  return {
    files,
    addFiles: (newFiles: FileItem[]) => setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles),
    removeFile,
    clearFiles,
    openFileDialog,
    getInputProps,
  }
}
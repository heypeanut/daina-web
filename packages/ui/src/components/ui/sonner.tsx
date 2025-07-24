"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-orange-500 group-[.toast]:text-white hover:group-[.toast]:bg-orange-600",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:bg-orange-500/90 group-[.toast]:text-white group-[.toast]:border-orange-300/30",
          error: "group-[.toast]:bg-red-500/90 group-[.toast]:text-white group-[.toast]:border-red-300/30",
          warning: "group-[.toast]:bg-yellow-500/90 group-[.toast]:text-white group-[.toast]:border-yellow-300/30",
          info: "group-[.toast]:bg-blue-500/90 group-[.toast]:text-white group-[.toast]:border-blue-300/30",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

'use client'

import { Toaster } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Toaster>

const Sonner = ({ ...props }: ToasterProps) => {
  return (
    <Toaster
      // richColors
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-background',
          cancelButton: 'group-[.toast]:bg-primary-neutral group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Sonner }

'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toastVariants = cva(
  'fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0',
  {
    variants: {
      variant: {
        default: 'bg-white text-secondary-900',
        success: 'bg-success-50 text-success-700',
        error: 'bg-error-50 text-error-700',
        warning: 'bg-warning-50 text-warning-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string
  duration?: number
  onClose?: () => void
}

export function Toast({
  message,
  variant,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose, mounted])

  if (!mounted || !isVisible) return null

  return createPortal(
    <div
      role="alert"
      className={cn(
        toastVariants({ variant }),
        isVisible ? 'opacity-100' : 'opacity-0 translate-y-2'
      )}
    >
      <span className="mr-2">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="ml-auto text-current opacity-50 hover:opacity-100"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>,
    document.body
  )
}

// Hook para gerenciar múltiplos toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const show = (props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...props, id, onClose: () => remove(id) }])
  }

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (message: string, duration?: number) => {
    show({ message, variant: 'success', duration })
  }

  const error = (message: string, duration?: number) => {
    show({ message, variant: 'error', duration })
  }

  const warning = (message: string, duration?: number) => {
    show({ message, variant: 'warning', duration })
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
  }
}

// Componente provedor de toasts
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <>
      {createPortal(
        toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        )),
        document.body
      )}
      {children}
    </>
  )
}

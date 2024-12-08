import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const loadingVariants = cva('animate-spin rounded-full border-current', {
  variants: {
    size: {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-3',
      lg: 'h-12 w-12 border-4',
    },
    variant: {
      default: 'border-t-transparent',
      primary: 'border-primary-600 border-t-transparent',
      secondary: 'border-secondary-600 border-t-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
})

export interface LoadingProps extends VariantProps<typeof loadingVariants> {
  className?: string
}

export function Loading({ size, variant, className }: LoadingProps) {
  return (
    <div
      className={cn(loadingVariants({ size, variant }), className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading size="lg" />
    </div>
  )
}

export function LoadingSection() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loading size="md" />
    </div>
  )
}

export function LoadingInline() {
  return <Loading size="sm" className="inline-block" />
}

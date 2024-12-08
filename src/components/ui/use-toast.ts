import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000

type ToastT = {
  id: string
  type?: "success" | "error" | "default"
  content: React.ReactNode
  action?: React.ReactNode
}

type State = {
  toasts: ToastT[]
}

const state: State = { toasts: [] }

const listeners: Array<(state: State) => void> = []

function dispatch(action: { type: string; payload?: any }) {
  state.toasts = []
  listeners.forEach((listener) => {
    listener(state)
  })
}

function toast(opts: ToastT) {
  const id = genId()

  const update = (props: Partial<ToastT>) => {
    state.toasts = state.toasts.map((t) =>
      t.id === id ? { ...t, ...props } : t
    )
    dispatch({ type: "update", payload: { id, props } })
  }

  const dismiss = () => {
    dispatch({ type: "remove", payload: { id } })
  }

  return {
    id,
    dismiss,
    update,
  }
}

function genId() {
  return Math.random().toString(36).substring(2, 9)
}

function useToast() {
  const [state, setState] = React.useState<State>({ toasts: [] })

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "remove", payload: { id: toastId } }),
  }
}

export { useToast, toast }

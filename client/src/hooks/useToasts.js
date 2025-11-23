import { useState, useEffect } from 'react'

let listeners = []

export function addToast(message, type = 'success') {
  const toast = {
    id: Date.now() + Math.random(),
    message,
    type,
  }
  listeners.forEach((fn) => fn(toast))
}

export default function useToasts() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleAdd = (toast) => {
      setToasts((prev) => [...prev, toast])
    }

    listeners.push(handleAdd)

    return () => {
      listeners = listeners.filter((fn) => fn !== handleAdd)
    }
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return

    const timers = toasts.map((t) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
      }, 3500)
    )

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [toasts])

  return { toasts }
}

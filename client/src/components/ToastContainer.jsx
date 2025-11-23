import React from 'react'
import useToasts from '../hooks/useToasts'

export default function ToastContainer() {
  const { toasts } = useToasts()

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-lg shadow text-white ${
            t.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

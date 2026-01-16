import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose()
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} card p-6 shadow-2xl animate-slide-up`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-200 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ink-800"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

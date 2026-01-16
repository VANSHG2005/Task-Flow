export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="text-5xl mb-4 opacity-30">{icon || '📭'}</div>
      <h3 className="text-ink-300 font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-ink-500 text-sm mb-5 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

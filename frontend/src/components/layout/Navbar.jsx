export default function Navbar({ title, onMenuClick }) {
  return (
    <header className="h-16 border-b border-ink-800 bg-ink-950/80 backdrop-blur-sm flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden btn-ghost p-2 rounded-lg"
        aria-label="Toggle menu"
      >
        <div className="space-y-1.5">
          <span className="block w-5 h-0.5 bg-ink-400" />
          <span className="block w-5 h-0.5 bg-ink-400" />
          <span className="block w-4 h-0.5 bg-ink-400" />
        </div>
      </button>
      <h1 className="font-bold text-xl text-ink-50">{title}</h1>
    </header>
  )
}

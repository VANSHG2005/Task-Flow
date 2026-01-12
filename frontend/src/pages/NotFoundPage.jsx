import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="text-center animate-slide-up">
        <div className="text-8xl font-black text-ink-800 mb-4 font-mono">404</div>
        <h1 className="text-2xl font-bold text-ink-300 mb-2">Page not found</h1>
        <p className="text-ink-600 mb-8 text-sm">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

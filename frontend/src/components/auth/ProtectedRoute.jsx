import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../common/Spinner'

export default function ProtectedRoute() {
  const { token, initialized } = useAuth()

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <Spinner size="lg" />
      </div>
    )
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />
}

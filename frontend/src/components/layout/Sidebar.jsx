import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard',  icon: '▦',  label: 'Dashboard'  },
  { to: '/analytics',  icon: '◈',  label: 'Analytics'  },
  { to: '/profile',    icon: '◎',  label: 'Profile'    },
  { to: '/settings',   icon: '⊙',  label: 'Settings'   },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('See you later!')
    navigate('/')          // ← go to cover/landing page on logout
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-ink-950/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64 bg-ink-950 border-r border-ink-800
        flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-ink-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-ink-950 font-black text-sm">TF</div>
            <span className="font-black text-xl tracking-tight text-ink-50">TaskFlow</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 font-medium text-sm
                ${isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'text-ink-400 hover:bg-ink-800 hover:text-ink-100'
                }`
              }
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-ink-800">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-2 py-2 rounded-lg mb-2 hover:bg-ink-800 transition-colors"
          >
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-ink-950 font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink-100 truncate">{user?.name}</div>
              <div className="text-xs text-ink-500 truncate font-mono">{user?.email}</div>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-ink-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-150 text-sm font-medium"
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
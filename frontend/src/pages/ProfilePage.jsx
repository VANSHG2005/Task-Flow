import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

const AVATAR_COLORS = [
  { bg: 'bg-amber-500',   hex: '#f59e0b', label: 'Amber'   },
  { bg: 'bg-blue-500',    hex: '#3b82f6', label: 'Blue'    },
  { bg: 'bg-emerald-500', hex: '#10b981', label: 'Emerald' },
  { bg: 'bg-rose-500',    hex: '#f43f5e', label: 'Rose'    },
  { bg: 'bg-violet-500',  hex: '#8b5cf6', label: 'Violet'  },
  { bg: 'bg-cyan-500',    hex: '#06b6d4', label: 'Cyan'    },
]

const TABS = ['Overview', 'Edit Profile', 'Security', 'Danger Zone']

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const [activeTab, setActiveTab]   = useState('Overview')
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || '#f59e0b')

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio:  user?.bio  || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword:  '',
    password:         '',
    confirmPassword:  '',
  })

  const [profileLoading,  setProfileLoading]  = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [deleteInput,     setDeleteInput]     = useState('')

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

  const daysSinceJoin = user?.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
    : 0

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const { data } = await userService.updateProfile({ ...profileForm, avatarColor })
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.password !== passwordForm.confirmPassword)
      return toast.error('Passwords do not match')
    if (passwordForm.password.length < 6)
      return toast.error('Password must be at least 6 characters')
    setPasswordLoading(true)
    try {
      await userService.updateProfile({
        currentPassword: passwordForm.currentPassword,
        password: passwordForm.password,
      })
      toast.success('Password changed!')
      setPasswordForm({ currentPassword: '', password: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    if (deleteInput !== 'DELETE') return toast.error('Type DELETE to confirm')
    toast.error('Account deletion is disabled in this demo.')
  }

  return (
    <div className="animate-fade-in max-w-3xl space-y-6">

      {/* ── Profile hero card ── */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-amber-500/10 to-transparent" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-3xl flex-shrink-0 shadow-lg"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-ink-50">{user?.name}</h2>
            <p className="text-ink-500 text-sm font-mono">{user?.email}</p>
            {user?.bio && <p className="text-ink-400 text-sm mt-1 italic">"{user.bio}"</p>}
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <div className="text-xs text-ink-600 font-mono">Joined {joinDate}</div>
            <div className="text-xs font-mono text-amber-500">{daysSinceJoin} days active</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-ink-800">
          {[
            { label: 'Member For', value: `${daysSinceJoin}d` },
            { label: 'Account',    value: 'Active' },
            { label: 'Plan',       value: 'Free'   },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-lg font-black font-mono text-ink-100">{value}</div>
              <div className="text-xs text-ink-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-ink-900 border border-ink-800 rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-xs sm:text-sm font-medium py-2 px-2 rounded-lg transition-all duration-150
              ${activeTab === tab
                ? 'bg-amber-500 text-ink-950'
                : 'text-ink-400 hover:text-ink-100'
              }
              ${tab === 'Danger Zone' && activeTab !== tab ? 'hover:text-rose-400' : ''}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {activeTab === 'Overview' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-4 text-sm uppercase tracking-wider">Account Details</h3>
            <div className="space-y-3">
              {[
                { label: 'Full Name',   value: user?.name  },
                { label: 'Email',       value: user?.email },
                { label: 'Bio',         value: user?.bio || '—' },
                { label: 'Member Since', value: joinDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-4 py-2 border-b border-ink-800/50 last:border-0">
                  <span className="text-xs text-ink-500 font-mono w-28 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-ink-200 font-medium break-all">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-4 text-sm uppercase tracking-wider">Avatar Color</h3>
            <div className="flex gap-3 flex-wrap">
              {AVATAR_COLORS.map(({ bg, hex, label }) => (
                <button
                  key={hex}
                  onClick={() => setAvatarColor(hex)}
                  title={label}
                  className={`w-10 h-10 ${bg} rounded-xl transition-all duration-200 hover:scale-110 ${avatarColor === hex ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-ink-900 scale-110' : ''}`}
                />
              ))}
            </div>
            <button onClick={handleProfileSubmit} className="btn-primary mt-4 text-sm">
              Save Color
            </button>
          </div>
        </div>
      )}

      {/* ── Edit Profile tab ── */}
      {activeTab === 'Edit Profile' && (
        <div className="card p-6 animate-fade-in">
          <h3 className="font-bold text-ink-100 mb-5 flex items-center gap-2">
            <span className="text-amber-500">◎</span> Edit Profile
          </h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Full Name</label>
              <input name="name" value={profileForm.name}
                onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                className="input-field" required maxLength={50} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Email</label>
              <input value={user?.email || ''} className="input-field opacity-40 cursor-not-allowed" disabled />
              <p className="text-xs text-ink-600 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Bio</label>
              <textarea
                name="bio" value={profileForm.bio}
                onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="A short bio about yourself..."
                className="input-field resize-none" rows={3} maxLength={200}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-ink-600">Shown on your profile overview</p>
                <p className="text-xs text-ink-600 font-mono">{profileForm.bio.length}/200</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-3">Avatar Color</label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map(({ bg, hex }) => (
                  <button key={hex} type="button" onClick={() => setAvatarColor(hex)}
                    className={`w-8 h-8 ${bg} rounded-lg transition-all hover:scale-110 ${avatarColor === hex ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-ink-900' : ''}`} />
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="btn-primary flex items-center gap-2" disabled={profileLoading}>
                {profileLoading && <Spinner size="sm" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Security tab ── */}
      {activeTab === 'Security' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-5 flex items-center gap-2">
              <span className="text-amber-500">⊙</span> Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {[
                { name: 'currentPassword', label: 'Current Password',  placeholder: '••••••••'           },
                { name: 'password',        label: 'New Password',       placeholder: 'Minimum 6 characters' },
                { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat password'   },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-ink-300 mb-2">{label}</label>
                  <input
                    type="password" name={name} value={passwordForm[name]}
                    onChange={e => setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                    placeholder={placeholder} className="input-field" required
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={passwordLoading}>
                  {passwordLoading && <Spinner size="sm" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-3 text-sm uppercase tracking-wider">Active Sessions</h3>
            <div className="flex items-center justify-between py-3 border border-ink-800 rounded-lg px-4">
              <div>
                <div className="text-sm font-medium text-ink-200">Current Session</div>
                <div className="text-xs text-ink-500 font-mono mt-0.5">Browser · Active now</div>
              </div>
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full font-mono">Current</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Danger Zone tab ── */}
      {activeTab === 'Danger Zone' && (
        <div className="card p-6 border-rose-500/20 animate-fade-in">
          <h3 className="font-bold text-rose-400 mb-2 flex items-center gap-2">
            <span>⚠</span> Danger Zone
          </h3>
          <p className="text-ink-500 text-sm mb-6">These actions are irreversible. Please proceed with caution.</p>

          <div className="space-y-4">
            <div className="border border-rose-500/20 rounded-xl p-4 bg-rose-500/5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-sm font-semibold text-ink-200">Delete Account</div>
                  <div className="text-xs text-ink-500 mt-0.5">Permanently delete your account and all data. This cannot be undone.</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink-400 mb-1.5">
                    Type <span className="font-mono text-rose-400 bg-rose-500/10 px-1 rounded">DELETE</span> to confirm
                  </label>
                  <input
                    value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                    placeholder="DELETE" className="input-field border-rose-500/30 focus:ring-rose-500/30 focus:border-rose-500/30"
                  />
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
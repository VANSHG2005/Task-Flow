import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: ''
  })

  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleProfileChange = (e) =>
    setProfileForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handlePasswordChange = (e) =>
    setPasswordForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const { data } = await userService.updateProfile(profileForm)
      updateUser(data.user)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.password !== passwordForm.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    if (passwordForm.password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    setPasswordLoading(true)
    try {
      await userService.updateProfile({
        currentPassword: passwordForm.currentPassword,
        password: passwordForm.password
      })
      toast.success('Password changed')
      setPasswordForm({ currentPassword: '', password: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="animate-fade-in max-w-2xl space-y-6">
      {/* Profile header */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-ink-950 font-black text-2xl flex-shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-black text-ink-50">{user?.name}</h2>
          <p className="text-ink-500 text-sm font-mono">{user?.email}</p>
          <p className="text-ink-600 text-xs mt-1">Member since {joinDate}</p>
        </div>
      </div>

      {/* Edit profile */}
      <div className="card p-6">
        <h3 className="font-bold text-ink-100 mb-5 flex items-center gap-2">
          <span className="text-amber-500">◎</span> Edit Profile
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">Full Name</label>
            <input
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              className="input-field"
              required
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">Email</label>
            <input
              value={user?.email || ''}
              className="input-field opacity-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-ink-600 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={profileForm.bio}
              onChange={handleProfileChange}
              placeholder="Tell us a bit about yourself..."
              className="input-field resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-ink-600 mt-1">{profileForm.bio.length}/200</p>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={profileLoading}>
              {profileLoading && <Spinner size="sm" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <h3 className="font-bold text-ink-100 mb-5 flex items-center gap-2">
          <span className="text-amber-500">⊙</span> Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">New Password</label>
            <input
              type="password"
              name="password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              placeholder="Minimum 6 characters"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Repeat new password"
              className="input-field"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={passwordLoading}>
              {passwordLoading && <Spinner size="sm" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

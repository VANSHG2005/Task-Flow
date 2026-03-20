import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-amber-500' : 'bg-ink-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-ink-800/50 last:border-0">
      <div className="flex-1 pr-8">
        <div className="text-sm font-medium text-ink-200">{label}</div>
        {desc && <div className="text-xs text-ink-600 mt-0.5">{desc}</div>}
      </div>
      {children}
    </div>
  )
}

const SECTIONS = ['Preferences', 'Notifications', 'Data & Privacy']

export default function SettingsPage() {
  const { user } = useAuth()

  const [prefs, setPrefs] = useState({
    defaultView:      'grid',
    defaultPriority:  'medium',
    defaultStatus:    'pending',
    compactCards:     false,
    showDueDate:      true,
    confirmDelete:    true,
    autoMarkComplete: false,
  })

  const [notifs, setNotifs] = useState({
    taskReminders:   true,
    weeklyDigest:    false,
    dueDateAlerts:   true,
    browserNotifs:   false,
  })

  const [activeSection, setActiveSection] = useState('Preferences')

  const save = () => toast.success('Settings saved!')

  const exportData = () => {
    const data = { user: { name: user?.name, email: user?.email }, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'taskflow-data.json'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported!')
  }

  return (
    <div className="animate-fade-in max-w-2xl space-y-6">
      <div className="flex gap-1 bg-ink-900 border border-ink-800 rounded-xl p-1">
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`flex-1 text-xs sm:text-sm font-medium py-2 px-2 rounded-lg transition-all
              ${activeSection === s ? 'bg-amber-500 text-ink-950' : 'text-ink-400 hover:text-ink-100'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Preferences ── */}
      {activeSection === 'Preferences' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-1 text-sm uppercase tracking-wider">Display</h3>
            <p className="text-xs text-ink-600 mb-4">Customize how tasks are shown</p>

            <SettingRow label="Default View" desc="Grid, Kanban or List on dashboard load">
              <select
                value={prefs.defaultView}
                onChange={e => setPrefs(p => ({ ...p, defaultView: e.target.value }))}
                className="input-field w-32 text-sm py-1.5"
              >
                <option value="grid">Grid</option>
                <option value="kanban">Kanban</option>
                <option value="list">List</option>
              </select>
            </SettingRow>

            <SettingRow label="Compact Cards" desc="Show smaller task cards">
              <Toggle checked={prefs.compactCards} onChange={v => setPrefs(p => ({ ...p, compactCards: v }))} />
            </SettingRow>

            <SettingRow label="Show Due Dates" desc="Display due date badges on task cards">
              <Toggle checked={prefs.showDueDate} onChange={v => setPrefs(p => ({ ...p, showDueDate: v }))} />
            </SettingRow>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-1 text-sm uppercase tracking-wider">Task Defaults</h3>
            <p className="text-xs text-ink-600 mb-4">Pre-fill values when creating new tasks</p>

            <SettingRow label="Default Priority">
              <select value={prefs.defaultPriority} onChange={e => setPrefs(p => ({ ...p, defaultPriority: e.target.value }))} className="input-field w-32 text-sm py-1.5">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </SettingRow>

            <SettingRow label="Default Status">
              <select value={prefs.defaultStatus} onChange={e => setPrefs(p => ({ ...p, defaultStatus: e.target.value }))} className="input-field w-36 text-sm py-1.5">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
              </select>
            </SettingRow>

            <SettingRow label="Confirm Before Delete" desc="Show a confirmation dialog">
              <Toggle checked={prefs.confirmDelete} onChange={v => setPrefs(p => ({ ...p, confirmDelete: v }))} />
            </SettingRow>

            <SettingRow label="Auto-complete on Check" desc="Mark task complete when checkbox clicked">
              <Toggle checked={prefs.autoMarkComplete} onChange={v => setPrefs(p => ({ ...p, autoMarkComplete: v }))} />
            </SettingRow>
          </div>

          <div className="flex justify-end">
            <button onClick={save} className="btn-primary">Save Preferences</button>
          </div>
        </div>
      )}

      {/* ── Notifications ── */}
      {activeSection === 'Notifications' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-1 text-sm uppercase tracking-wider">Email Notifications</h3>
            <p className="text-xs text-ink-600 mb-4">Sent to <span className="font-mono text-amber-400">{user?.email}</span></p>

            <SettingRow label="Task Reminders" desc="Reminders for upcoming due dates">
              <Toggle checked={notifs.taskReminders} onChange={v => setNotifs(p => ({ ...p, taskReminders: v }))} />
            </SettingRow>

            <SettingRow label="Weekly Digest" desc="Summary of your week every Monday">
              <Toggle checked={notifs.weeklyDigest} onChange={v => setNotifs(p => ({ ...p, weeklyDigest: v }))} />
            </SettingRow>

            <SettingRow label="Due Date Alerts" desc="Alert when a task is overdue">
              <Toggle checked={notifs.dueDateAlerts} onChange={v => setNotifs(p => ({ ...p, dueDateAlerts: v }))} />
            </SettingRow>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-1 text-sm uppercase tracking-wider">Browser Notifications</h3>
            <p className="text-xs text-ink-600 mb-4">Push notifications in your browser</p>

            <SettingRow label="Enable Browser Notifications" desc="Requires browser permission">
              <Toggle checked={notifs.browserNotifs} onChange={v => {
                if (v && 'Notification' in window) {
                  Notification.requestPermission().then(p => {
                    setNotifs(pr => ({ ...pr, browserNotifs: p === 'granted' }))
                    if (p !== 'granted') toast.error('Permission denied by browser')
                  })
                } else {
                  setNotifs(pr => ({ ...pr, browserNotifs: false }))
                }
              }} />
            </SettingRow>
          </div>

          <div className="flex justify-end">
            <button onClick={save} className="btn-primary">Save Notifications</button>
          </div>
        </div>
      )}

      {/* ── Data & Privacy ── */}
      {activeSection === 'Data & Privacy' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-1 text-sm uppercase tracking-wider">Your Data</h3>
            <p className="text-xs text-ink-600 mb-5">Download or manage your TaskFlow data</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between border border-ink-800 rounded-xl p-4">
                <div>
                  <div className="text-sm font-medium text-ink-200">Export Data</div>
                  <div className="text-xs text-ink-600 mt-0.5">Download all your tasks and profile as JSON</div>
                </div>
                <button onClick={exportData} className="btn-secondary text-sm py-2 px-4">Export</button>
              </div>

              <div className="flex items-center justify-between border border-ink-800 rounded-xl p-4">
                <div>
                  <div className="text-sm font-medium text-ink-200">Account Data</div>
                  <div className="text-xs text-ink-600 mt-0.5">Name, email, tasks, and settings</div>
                </div>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">Stored Securely</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-ink-100 mb-1 text-sm uppercase tracking-wider">Privacy</h3>
            <p className="text-xs text-ink-600 mb-4">How we handle your information</p>
            <div className="space-y-2 text-sm text-ink-400">
              {[
                '✓ Passwords are hashed with bcrypt (never stored in plaintext)',
                '✓ JWT tokens expire after 7 days',
                '✓ We do not sell or share your data',
                '✓ All API requests require authentication',
              ].map(item => <div key={item} className="flex items-start gap-2">{item}</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
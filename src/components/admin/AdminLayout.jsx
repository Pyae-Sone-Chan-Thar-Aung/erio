import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, BarChart3, Globe, Calendar, Home, Settings } from 'lucide-react'
import { authAPI } from '../../services/supabaseApi'
import OrganicShapes from '../OrganicShapes'

export default function AdminLayout({ onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    authAPI.logout()
    onLogout()
    navigate('/')
  }

  const navItems = [
    { path: '/admin', icon: Home, label: 'Overview', exact: true },
    { path: '/admin/stats', icon: BarChart3, label: 'Dashboard Stats' },
    { path: '/admin/partners', icon: Globe, label: 'Partner Universities' },
    { path: '/admin/activities', icon: Calendar, label: 'Recent Activities' },
  ]

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-beige-50">
      {/* Background shapes */}
      <OrganicShapes />
      
      <div className="relative z-10 flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 min-h-screen glass-card border-r border-white/20 shadow-glass-lg">
          <div className="p-6">
            {/* Logo/Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center shadow-glass-sm">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              </div>
              <p className="text-sm text-gray-600">ERIO Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path, item.exact)
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-glass ${
                      active
                        ? 'glass-strong text-pink-600 shadow-glass-sm border-2 border-pink-200/50'
                        : 'glass text-gray-700 hover:glass-strong hover:text-pink-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Logout Button */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold glass text-gray-700 hover:glass-strong hover:text-red-600 transition-glass"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

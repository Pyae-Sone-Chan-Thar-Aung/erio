import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, BarChart3, Globe, Calendar, Home, Settings } from 'lucide-react'
import { authAPI } from '../../services/supabaseApi'
import OrganicShapes from '../OrganicShapes'
import uicErioLogo from '../../assets/uic-erio-logo(1).png'

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
    <div className="h-screen relative overflow-hidden bg-beige-50">
      {/* Background shapes */}
      <OrganicShapes />

      <div className="relative z-10 flex h-full">
        {/* Sidebar Navigation - Fixed, Unscrollable */}
        <aside className="w-64 h-screen fixed left-0 top-0 glass-card border-r border-white/20 shadow-glass-lg overflow-hidden flex flex-col">
          <div className="p-6 flex-1 overflow-hidden flex flex-col">
            {/* Logo/Header */}
            <div className="mb-8 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <img src={uicErioLogo} alt="UIC ERIO Logo" className="h-16 w-auto object-contain" />
              </div>
              <h1 className="text-sm font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-600">ERIO Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path, item.exact)
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-glass ${active
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

            {/* Logout Button - Spacer */}
            <div className="mt-auto pt-8 border-t border-white/20 flex-shrink-0">
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

        {/* Main Content - Scrollable */}
        <main className="flex-1 h-screen ml-64 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

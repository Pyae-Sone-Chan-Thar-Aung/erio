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
            {/* Top badge */}
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-pink flex items-center justify-center shadow-glass-sm">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Admin Panel</div>
                <div className="text-xs text-gray-500">ERIO Dashboard</div>
              </div>
            </div>

            {/* Navigation - pill style */}
            <nav className="space-y-3 flex-shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path, item.exact)
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all ${active
                      ? 'bg-pink-50 text-pink-600 shadow-glass-sm'
                      : 'text-gray-700 hover:bg-white/5'
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? 'bg-white/90' : 'bg-white/5'}`}>
                      <Icon className={`w-4 h-4 ${active ? 'text-pink-600' : 'text-gray-200'}`} />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Logo centered lower */}
            <div className="mt-6 flex justify-center">
              <img src={uicErioLogo} alt="UIC ERIO Logo" className="h-28 w-auto object-contain" />
            </div>

            {/* Logout Button at bottom */}
            <div className="mt-auto px-4 py-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-700 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
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

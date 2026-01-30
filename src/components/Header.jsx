import { Globe, BarChart3, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/uic-erio-logo.png'

export default function Header({ activeView, setActiveView, onAdminClick }) {
  const navigate = useNavigate()

  const handleAdminClick = () => {
    if (onAdminClick) {
      onAdminClick()
    } else {
      navigate('/admin/login')
    }
  }

  return (
    <header className="glass-card rounded-3xl mx-4 mt-6 mb-10 p-5 md:p-7 shadow-glass-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-glass-sm overflow-hidden">
            <img
              src={logo}
              alt="UIC ERIO Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              UIC External Relations and Internationalization Office
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-0.5">
              University of the Immaculate Conception, Davao City, Philippines
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <nav className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex-1 md:flex-none px-5 md:px-7 py-3 rounded-2xl font-semibold transition-glass text-sm md:text-base ${
                activeView === 'dashboard'
                  ? 'glass-strong text-pink-600 shadow-glass-sm border-2 border-pink-200/50'
                  : 'glass text-gray-700 hover:glass-strong hover:text-pink-600'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex-1 md:flex-none px-5 md:px-7 py-3 rounded-2xl font-semibold transition-glass text-sm md:text-base ${
                activeView === 'map'
                  ? 'glass-strong text-pink-600 shadow-glass-sm border-2 border-pink-200/50'
                  : 'glass text-gray-700 hover:glass-strong hover:text-pink-600'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Partner Map
            </button>
          </nav>
          <button
            onClick={handleAdminClick}
            className="glass w-12 h-12 rounded-2xl font-semibold text-gray-700 hover:glass-strong transition-glass flex items-center justify-center"
            title="Admin Login"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

import { useState, useEffect } from 'react'
import { BarChart3, Globe, Calendar, TrendingUp, Users, Link2 } from 'lucide-react'
import { dashboardAPI, partnersAPI, activitiesAPI } from '../../services/supabaseApi'
import { useNavigate } from 'react-router-dom'

export default function AdminOverview() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [partnersCount, setPartnersCount] = useState(0)
  const [activitiesCount, setActivitiesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, partnersData, activitiesData] = await Promise.all([
          dashboardAPI.getStats(),
          partnersAPI.getAll(),
          activitiesAPI.getAll()
        ])

        setStats(statsData)
        setPartnersCount(partnersData?.length || 0)
        setActivitiesCount(activitiesData?.length || 0)
      } catch (error) {
        console.error('Error loading overview data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const quickStats = [
    {
      label: 'Partner Universities',
      value: stats?.partnerUniversities || partnersCount || 0,
      icon: Globe,
      color: 'pink',
      path: '/admin/partners'
    },
    {
      label: 'Active Agreements',
      value: stats?.activeAgreements || 0,
      icon: Link2,
      color: 'pink',
      path: '/admin/stats'
    },
    {
      label: 'Student Exchanges',
      value: stats?.studentExchanges || 0,
      icon: Users,
      color: 'pink',
      path: '/admin/stats'
    },
    {
      label: 'Recent Activities',
      value: activitiesCount || 0,
      icon: Calendar,
      color: 'pink',
      path: '/admin/activities'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 shadow-glass-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Overview</h1>
        <p className="text-gray-600">Manage and monitor your dashboard content</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <button
              key={stat.label}
              onClick={() => navigate(stat.path)}
              className="glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-lg transition-glass group relative overflow-hidden text-left"
            >
              <div className="absolute inset-0 gradient-pink-radial opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl gradient-pink flex items-center justify-center shadow-glass-sm group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 tracking-wide">{stat.label}</h3>
                <p className="text-4xl font-bold text-gray-800 tracking-tight">{stat.value}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/admin/stats')}
          className="glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-lg transition-glass group text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center shadow-glass-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Dashboard Stats</h3>
              <p className="text-sm text-gray-600">Edit statistics</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Update partner counts, agreements, exchanges, and engagement metrics</p>
        </button>

        <button
          onClick={() => navigate('/admin/partners')}
          className="glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-lg transition-glass group text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center shadow-glass-sm">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Partner Universities</h3>
              <p className="text-sm text-gray-600">Manage partners</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Add, edit, or remove partner universities from the map</p>
        </button>

        <button
          onClick={() => navigate('/admin/activities')}
          className="glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-lg transition-glass group text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center shadow-glass-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
              <p className="text-sm text-gray-600">Manage activities</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Add or update recent activities and news items</p>
        </button>
      </div>
    </div>
  )
}

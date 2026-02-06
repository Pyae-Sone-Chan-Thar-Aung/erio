import { useState, useEffect } from 'react'
import { TrendingUp, Users, Globe, Link2, Calendar, Award, Eye } from 'lucide-react'
import StatsCard from './StatsCard'
import EngagementChart from './EngagementChart'
import RecentActivities from './RecentActivities'
import { dashboardAPI, viewCounterAPI, partnersAPI, engagementAPI, mobilityProgrammesAPI, eventsAPI } from '../services/supabaseApi'

export default function Dashboard({ onPartnerUniversitiesClick, onMobilityProgrammeClick, onEventsClick }) {
  const [dashboardData, setDashboardData] = useState({
    partnerUniversities: 0,
    activeAgreements: 0,
    studentExchanges: 0,
    eventsThisYear: 0,
    mobilityProgrammeCount: 0,
    eventsCount: 0,
    regionalDistribution: { asiaPacific: 88, europe: 7, americas: 5 },
    programsOffered: { exchange: 68, research: 24, summer: 18 },
    engagementScore: 9.2
  })
  const [totalViews, setTotalViews] = useState(0)

  useEffect(() => {
    // Track page view and load data from API
    const loadStats = async () => {
      try {
        // Increment view count
        await viewCounterAPI.incrementView()

        // Get total views
        const views = await viewCounterAPI.getTotalViews()
        setTotalViews(views)
      } catch (error) {
        console.error('Error tracking views:', error)
      }

      try {
        const stats = await dashboardAPI.getStats()

        // Fetch real partner count from database
        try {
          const partners = await partnersAPI.getAll()
          stats.partnerUniversities = partners.length
        } catch (error) {
          console.debug('Partner count fallback:', error?.message)
        }

        // Fetch real mobility programme count from database
        try {
          stats.mobilityProgrammeCount = await mobilityProgrammesAPI.getCount()
        } catch (error) {
          console.debug('Mobility count fallback:', error?.message)
          stats.mobilityProgrammeCount = 0
        }

        // Fetch real events count from database
        try {
          stats.eventsCount = await eventsAPI.getCount()
        } catch (error) {
          console.debug('Events count fallback:', error?.message)
          stats.eventsCount = 0
        }

        // Calculate engagement score automatically
        try {
          const engagementScore = await engagementAPI.calculateEngagementScore()
          stats.engagementScore = engagementScore
        } catch (error) {
          console.debug('Error calculating engagement score, using stored value')
        }

        setDashboardData(stats)
        // Also save to localStorage as backup
        localStorage.setItem('publicDashboardStats', JSON.stringify(stats))
      } catch (error) {
        console.error('Error loading stats from API:', error)
        // Fallback to localStorage if API fails
        const savedStats = localStorage.getItem('publicDashboardStats')
        if (savedStats) {
          try {
            setDashboardData(JSON.parse(savedStats))
          } catch (e) {
            console.error('Error loading saved stats:', e)
          }
        }
      }
    }
    loadStats()
  }, [])

  const stats = [
    {
      title: 'Partner Universities',
      value: dashboardData.partnerUniversities.toString(),
      change: '+12%',
      trend: 'up',
      icon: Globe,
      color: 'pink',
      onClick: typeof onPartnerUniversitiesClick === 'function' ? onPartnerUniversitiesClick : undefined,
    },
    {
      title: 'Active Agreements',
      value: dashboardData.activeAgreements.toString(),
      change: '+5%',
      trend: 'up',
      icon: Link2,
      color: 'pink',
    },
    {
      title: 'Mobility Programme',
      value: String(dashboardData.mobilityProgrammeCount ?? 0),
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'pink',
      onClick: typeof onMobilityProgrammeClick === 'function' ? onMobilityProgrammeClick : undefined,
    },
    {
      title: 'Events This Year',
      value: String(dashboardData.eventsCount ?? 0),
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      color: 'pink',
      onClick: typeof onEventsClick === 'function' ? onEventsClick : undefined,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <EngagementChart />
        <RecentActivities />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 md:p-7 shadow-glass hover:shadow-glass-lg transition-glass">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">Programs Offered</h3>
            <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Exchange Programs</span>
              <span className="font-semibold text-gray-800">{dashboardData.programsOffered.exchange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Research Collaborations</span>
              <span className="font-semibold text-gray-800">{dashboardData.programsOffered.research}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Summer Programs</span>
              <span className="font-semibold text-gray-800">{dashboardData.programsOffered.summer}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-7 shadow-glass hover:shadow-glass-lg transition-glass">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">Regional Distribution</h3>
            <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Asia Pacific</span>
              <span className="font-semibold text-gray-800">{dashboardData.regionalDistribution.asiaPacific}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Europe</span>
              <span className="font-semibold text-gray-800">{dashboardData.regionalDistribution.europe}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Americas</span>
              <span className="font-semibold text-gray-800">{dashboardData.regionalDistribution.americas}%</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-7 shadow-glass hover:shadow-glass-lg transition-glass">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">Engagement Score</h3>
            <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-pink-600 mb-2">{dashboardData.engagementScore}/10</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="gradient-pink h-2 rounded-full"
                style={{ width: `${dashboardData.engagementScore * 10}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Excellent engagement rate</p>
          </div>
        </div>
      </div>

      {/* Custom Viewer Count Badge - Matching Design */}
      <div className="flex justify-center py-8">
        <div className="inline-flex items-center gap-0 overflow-hidden shadow-md">
          <div className="bg-gray-600 px-6 py-3 text-white font-semibold text-base">
            Website Viewers
          </div>
          <div className="bg-pink-500 px-6 py-3 text-white font-bold text-lg">
            {totalViews.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

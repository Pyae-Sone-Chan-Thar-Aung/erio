import { useState, useEffect } from 'react'
import { LogOut, Save, Plus, Trash2, Edit2, X, Globe, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dashboardAPI, partnersAPI, activitiesAPI, authAPI } from '../services/supabaseApi'

// Default partners list (all 76 partners)
const DEFAULT_PARTNERS = [
  { id: 1, name: 'Universiti Teknologi Brunei', country: 'Brunei', city: 'Bandar Seri Begawan', lat: 4.9031, lng: 114.9398 },
  { id: 2, name: 'Royal University of Phnom Penh', country: 'Cambodia', city: 'Phnom Penh', lat: 11.5564, lng: 104.9282 },
  { id: 3, name: "St. Mary's University of Calgary", country: 'Canada', city: 'Calgary', lat: 51.0447, lng: -114.0719 },
  { id: 4, name: 'UMAP International Secretariat', country: 'Canada', city: 'Toronto', lat: 43.6532, lng: -79.3832 },
  { id: 5, name: 'Karelia University of Applied Sciences', country: 'Finland', city: 'Joensuu', lat: 62.6010, lng: 29.7636 },
  { id: 6, name: 'Sulkhan-Saba Orbeliani University', country: 'Georgia', city: 'Tbilisi', lat: 41.7151, lng: 44.8271 },
  { id: 7, name: 'United Board for Higher Education in Asia', country: 'Hong Kong', city: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  { id: 8, name: 'Karpagam Academy of Higher Education', country: 'India', city: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { id: 9, name: 'Sri Krishna Arts and Science College', country: 'India', city: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { id: 10, name: 'Atma Jaya Catholic University of Indonesia', country: 'Indonesia', city: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { id: 11, name: 'Sekolah Menengah Kejuruan Muhammadiyah 3 Banjarmasin', country: 'Indonesia', city: 'Banjarmasin', lat: -3.3194, lng: 114.5911 },
  { id: 12, name: 'Universitas Ahmad Dalan', country: 'Indonesia', city: 'Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { id: 13, name: 'Universitas Bengkulu', country: 'Indonesia', city: 'Bengkulu', lat: -3.7928, lng: 102.2608 },
  { id: 14, name: 'Universitas Jambi', country: 'Indonesia', city: 'Jambi', lat: -1.6101, lng: 103.6068 },
  { id: 15, name: 'Universitas Katolik Santo Thomas', country: 'Indonesia', city: 'Medan', lat: 3.5952, lng: 98.6722 },
  { id: 16, name: 'Universitas Katolik Widya Mandala Surabaya', country: 'Indonesia', city: 'Surabaya', lat: -7.2575, lng: 112.7521 },
  { id: 17, name: 'Universitas Katolik Widya Mandira', country: 'Indonesia', city: 'Kupang', lat: -10.1772, lng: 123.6070 },
  { id: 18, name: 'Universitas Kristen Indonesia', country: 'Indonesia', city: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { id: 19, name: 'Universitas Lambung Mangkurat', country: 'Indonesia', city: 'Banjarmasin', lat: -3.3194, lng: 114.5911 },
  { id: 20, name: 'Universitas Negeri Jakarta', country: 'Indonesia', city: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { id: 21, name: 'Universitas Negeri Malang', country: 'Indonesia', city: 'Malang', lat: -7.9666, lng: 112.6326 },
  { id: 22, name: 'Universitas Negeri Semarang', country: 'Indonesia', city: 'Semarang', lat: -6.9667, lng: 110.4167 },
  { id: 23, name: 'Universitas Pendidikan Indonesia', country: 'Indonesia', city: 'Bandung', lat: -6.9175, lng: 107.6191 },
  { id: 24, name: 'Canvas Gate, Inc.', country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { id: 25, name: 'Japan University of Economics', country: 'Japan', city: 'Fukuoka', lat: 33.5904, lng: 130.4017 },
  { id: 26, name: 'Josai International University', country: 'Japan', city: 'Togane', lat: 35.5494, lng: 140.3678 },
  { id: 27, name: 'Kansai University', country: 'Japan', city: 'Osaka', lat: 34.6937, lng: 135.5023 },
  { id: 28, name: 'Musashi University', country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { id: 29, name: 'Osaka City University', country: 'Japan', city: 'Osaka', lat: 34.6937, lng: 135.5023 },
  { id: 30, name: 'University of Tsukuba', country: 'Japan', city: 'Tsukuba', lat: 36.1050, lng: 140.1000 },
  { id: 31, name: 'With The World', country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { id: 32, name: 'Catholic University of Korea', country: 'Korea', city: 'Seoul', lat: 37.5665, lng: 126.9780 },
  { id: 33, name: 'National University of Laos', country: 'Lao PDR', city: 'Vientiane', lat: 17.9757, lng: 102.6331 },
  { id: 34, name: 'University of Saint Joseph', country: 'Macau', city: 'Macau', lat: 22.1987, lng: 113.5439 },
  { id: 35, name: 'International Islamic University of Malaysia', country: 'Malaysia', city: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },
  { id: 36, name: 'Management & Science University', country: 'Malaysia', city: 'Shah Alam', lat: 3.0738, lng: 101.5183 },
  { id: 37, name: 'Universiti Kebangsaan Malaysia', country: 'Malaysia', city: 'Bangi', lat: 2.9300, lng: 101.7770 },
  { id: 38, name: 'Universiti Kuala Lumpur', country: 'Malaysia', city: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },
  { id: 39, name: 'Universiti Malaya', country: 'Malaysia', city: 'Kuala Lumpur', lat: 3.1201, lng: 101.6544 },
  { id: 40, name: 'Universiti Malaysia Sabah', country: 'Malaysia', city: 'Kota Kinabalu', lat: 6.0329, lng: 116.1180 },
  { id: 41, name: 'Universiti Pendidikan Sultan Idris', country: 'Malaysia', city: 'Tanjung Malim', lat: 3.6850, lng: 101.5200 },
  { id: 42, name: 'Universiti Sains Malaysia', country: 'Malaysia', city: 'Penang', lat: 5.3533, lng: 100.3019 },
  { id: 43, name: 'Universiti Teknologi MARA', country: 'Malaysia', city: 'Shah Alam', lat: 3.0738, lng: 101.5183 },
  { id: 44, name: 'Universiti Utara Malaysia', country: 'Malaysia', city: 'Sintok', lat: 6.4697, lng: 100.5060 },
  { id: 45, name: 'University College of MAIWP International', country: 'Malaysia', city: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },
  { id: 46, name: 'Kyaing Tong University', country: 'Myanmar', city: 'Kyaing Tong', lat: 21.3014, lng: 99.6080 },
  { id: 47, name: 'Nanyang Technological University', country: 'Singapore', city: 'Singapore', lat: 1.3483, lng: 103.6831 },
  { id: 48, name: 'Singapore University of Social Sciences', country: 'Singapore', city: 'Singapore', lat: 1.2966, lng: 103.7764 },
  { id: 49, name: 'Universidad Catolica San Antonio de Murcia', country: 'Spain', city: 'Murcia', lat: 37.9922, lng: -1.1307 },
  { id: 50, name: 'Chang Gung University of Science and Technology', country: 'Taiwan', city: 'Taoyuan', lat: 25.0330, lng: 121.5654 },
  { id: 51, name: 'Fu Jen Catholic University', country: 'Taiwan', city: 'New Taipei', lat: 25.0330, lng: 121.5654 },
  { id: 52, name: 'Kaohsiung Medical University', country: 'Taiwan', city: 'Kaohsiung', lat: 22.6273, lng: 120.3014 },
  { id: 53, name: 'National Quemoy University', country: 'Taiwan', city: 'Kinmen', lat: 24.4333, lng: 118.3667 },
  { id: 54, name: 'Providence University', country: 'Taiwan', city: 'Taichung', lat: 24.1477, lng: 120.6736 },
  { id: 55, name: 'Southern Taiwan University of Science and Technology', country: 'Taiwan', city: 'Tainan', lat: 22.9999, lng: 120.2269 },
  { id: 56, name: 'ASEAN University Network - Culture and Arts', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { id: 57, name: 'ASEAN University Network - Quality Assurance', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { id: 58, name: 'Burapha University', country: 'Thailand', city: 'Chonburi', lat: 13.3611, lng: 100.9847 },
  { id: 59, name: 'Chiang Mai Rajabhat University', country: 'Thailand', city: 'Chiang Mai', lat: 18.7883, lng: 98.9853 },
  { id: 60, name: 'Chiang Rai Rajabhat University', country: 'Thailand', city: 'Chiang Rai', lat: 19.9105, lng: 99.8406 },
  { id: 61, name: 'Durajkit Pundit University', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { id: 62, name: 'Huachiew Chalermprakiet University', country: 'Thailand', city: 'Samut Prakan', lat: 13.5993, lng: 100.5967 },
  { id: 63, name: "King Mongkut's University of Technology Thonburi", country: 'Thailand', city: 'Bangkok', lat: 13.6513, lng: 100.4947 },
  { id: 64, name: 'SEAMEO School Network', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { id: 65, name: 'SEAMEO SEA Teacher', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { id: 66, name: 'SEAMEO SEA TVET', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { id: 67, name: 'Mahidol University', country: 'Thailand', city: 'Bangkok', lat: 13.7899, lng: 100.3245 },
  { id: 68, name: 'Pan-Asia International School', country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { id: 69, name: 'Valaya Alongkorn Rajabhat University', country: 'Thailand', city: 'Pathum Thani', lat: 14.0208, lng: 100.5250 },
  { id: 70, name: 'Global School Alliance', country: 'United Kingdom', city: 'London', lat: 51.5074, lng: -0.1278 },
  { id: 71, name: 'University of Northampton', country: 'United Kingdom', city: 'Northampton', lat: 52.2405, lng: -0.9027 },
  { id: 72, name: 'University of Central Missouri', country: 'USA', city: 'Warrensburg', lat: 38.7631, lng: -93.7365 },
  { id: 73, name: 'University of Colorado Colorado Springs', country: 'USA', city: 'Colorado Springs', lat: 38.8933, lng: -104.8006 },
  { id: 74, name: 'Dong Thap University', country: 'Vietnam', city: 'Cao Lanh', lat: 10.4602, lng: 105.6330 },
  { id: 75, name: 'VNU-Ho Chi Minh City University of Social Sciences and Humanities', country: 'Vietnam', city: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297 },
  { id: 76, name: 'University of Economics and Finance', country: 'Vietnam', city: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297 }
]

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('stats')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Dashboard Stats State
  const [stats, setStats] = useState({
    partnerUniversities: 76,
    activeAgreements: 65,
    studentExchanges: 892,
    eventsThisYear: 32,
    regionalDistribution: {
      asiaPacific: 88,
      europe: 7,
      americas: 5
    },
    programsOffered: {
      exchange: 68,
      research: 24,
      summer: 18
    },
    engagementScore: 9.2
  })

  // Partners State
  const [partners, setPartners] = useState([])
  const [editingPartner, setEditingPartner] = useState(null)
  const [showPartnerForm, setShowPartnerForm] = useState(false)

  // Recent Activities State
  const [activities, setActivities] = useState([
    { id: 1, title: 'New Partnership Agreement', description: 'Signed MOU with Nanyang Technological University', date: 'January 20, 2026' },
    { id: 2, title: 'Student Exchange Program', description: 'Launched exchange program with Universiti Malaya', date: 'January 15, 2026' },
    { id: 3, title: 'International Conference', description: 'Hosted ASEAN University Network conference', date: 'January 10, 2026' }
  ])

  useEffect(() => {
    // Load data from API
    const loadData = async () => {
      try {
        // Load dashboard stats
        const statsData = await dashboardAPI.getStats()
        setStats({
          partnerUniversities: statsData.partnerUniversities || 76,
          activeAgreements: statsData.activeAgreements || 65,
          studentExchanges: statsData.studentExchanges || 892,
          eventsThisYear: statsData.eventsThisYear || 32,
          regionalDistribution: statsData.regionalDistribution || { asiaPacific: 88, europe: 7, americas: 5 },
          programsOffered: statsData.programsOffered || { exchange: 68, research: 24, summer: 18 },
          engagementScore: statsData.engagementScore || 9.2
        })

        // Load partners
        const partnersData = await partnersAPI.getAll()
        if (partnersData && partnersData.length > 0) {
          setPartners(partnersData)
        } else {
          loadDefaultPartners()
        }

        // Load activities
        const activitiesData = await activitiesAPI.getAll()
        if (activitiesData && activitiesData.length > 0) {
          setActivities(activitiesData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback to localStorage if API fails
        const savedStats = localStorage.getItem('adminDashboardStats')
        const savedPartners = localStorage.getItem('adminPartners')
        const savedActivities = localStorage.getItem('adminActivities')

        if (savedStats) {
          setStats(JSON.parse(savedStats))
        }
        if (savedPartners) {
          setPartners(JSON.parse(savedPartners))
        } else {
          loadDefaultPartners()
        }
        if (savedActivities) {
          setActivities(JSON.parse(savedActivities))
        }
      }
    }

    loadData()
  }, [])

  const loadDefaultPartners = () => {
    setPartners(DEFAULT_PARTNERS)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Save stats
      await dashboardAPI.updateStats(stats)
      
      // Save partners (only new/updated ones - in a real app, you'd track changes)
      // For now, we'll save all partners that don't have an ID from the database
      // This is a simplified approach - in production, you'd want to track which partners changed
      
      // Save activities (similar approach)
      
      // Also save to localStorage as backup
      localStorage.setItem('adminDashboardStats', JSON.stringify(stats))
      localStorage.setItem('adminPartners', JSON.stringify(partners))
      localStorage.setItem('adminActivities', JSON.stringify(activities))
      localStorage.setItem('publicDashboardStats', JSON.stringify(stats))
      localStorage.setItem('publicPartners', JSON.stringify(partners))
      localStorage.setItem('publicActivities', JSON.stringify(activities))

      setIsSaving(false)
      setSaveMessage('Changes saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving data:', error)
      setIsSaving(false)
      setSaveMessage('Error saving changes. Please try again.')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    onLogout()
    navigate('/')
  }

  const handleAddPartner = () => {
    setEditingPartner({
      id: Date.now(),
      name: '',
      country: '',
      city: '',
      lat: 0,
      lng: 0
    })
    setShowPartnerForm(true)
  }

  const handleEditPartner = (partner) => {
    setEditingPartner({ ...partner })
    setShowPartnerForm(true)
  }

  const handleDeletePartner = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        // If partner has a database ID (not a temporary one), delete from API
        const partner = partners.find(p => p.id === id)
        if (partner && typeof id === 'number' && id < 1000000000000) {
          // Likely a database ID (not a timestamp-based temporary ID)
          await partnersAPI.delete(id)
        }
        setPartners(partners.filter(p => p.id !== id))
      } catch (error) {
        console.error('Error deleting partner:', error)
        alert('Error deleting partner. Please try again.')
      }
    }
  }

  const handleSavePartner = async () => {
    if (!editingPartner.name || !editingPartner.country) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const partnerData = {
        name: editingPartner.name,
        country: editingPartner.country,
        city: editingPartner.city || '',
        lat: editingPartner.lat || 0,
        lng: editingPartner.lng || 0,
        students: editingPartner.students || 0,
        programs: editingPartner.programs || ['Student Exchange'],
        established: editingPartner.established || '',
        type: editingPartner.type || 'Comprehensive'
      }

      if (editingPartner.id && partners.find(p => p.id === editingPartner.id)) {
        // Update existing
        if (typeof editingPartner.id === 'number' && editingPartner.id < 1000000000000) {
          // Database ID - update via API
          const updated = await partnersAPI.update(editingPartner.id, partnerData)
          setPartners(partners.map(p => p.id === editingPartner.id ? updated : p))
        } else {
          // Temporary ID - just update locally
          setPartners(partners.map(p => p.id === editingPartner.id ? editingPartner : p))
        }
      } else {
        // Add new
        const newPartner = await partnersAPI.create(partnerData)
        setPartners([...partners, newPartner])
      }
      setShowPartnerForm(false)
      setEditingPartner(null)
    } catch (error) {
      console.error('Error saving partner:', error)
      alert('Error saving partner. Please try again.')
    }
  }

  const handleAddActivity = () => {
    const newActivity = {
      id: Date.now(), // Temporary ID
      title: '',
      description: '',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    setActivities([newActivity, ...activities])
  }

  const handleDeleteActivity = async (id) => {
    try {
      // If activity has a database ID, delete from API
      if (typeof id === 'number' && id < 1000000000000) {
        await activitiesAPI.delete(id)
      }
      setActivities(activities.filter(a => a.id !== id))
    } catch (error) {
      console.error('Error deleting activity:', error)
      alert('Error deleting activity. Please try again.')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-beige-50">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full gradient-pink-radial opacity-40 blur-[80px] animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-card rounded-3xl mx-4 mt-6 mb-6 p-5 md:p-7 shadow-glass-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-0.5">
                Manage public dashboard content
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="glass-strong px-6 py-3 rounded-2xl font-semibold text-white gradient-pink hover:shadow-glass-lg transition-glass disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleLogout}
                className="glass px-6 py-3 rounded-2xl font-semibold text-gray-700 hover:glass-strong transition-glass flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
          {saveMessage && (
            <div className="mt-4 glass-card rounded-xl p-3 bg-green-50/50 border border-green-200/50">
              <p className="text-sm text-green-600 text-center">{saveMessage}</p>
            </div>
          )}
        </header>

        <div className="container mx-auto px-4 pb-8">
          {/* Tabs */}
          <div className="glass-card rounded-3xl p-2 mb-6 shadow-glass flex gap-2">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-glass ${
                activeTab === 'stats'
                  ? 'glass-strong text-pink-600 shadow-glass-sm'
                  : 'text-gray-700 hover:glass-strong'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Dashboard Stats
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-glass ${
                activeTab === 'partners'
                  ? 'glass-strong text-pink-600 shadow-glass-sm'
                  : 'text-gray-700 hover:glass-strong'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Partner Universities
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-glass ${
                activeTab === 'activities'
                  ? 'glass-strong text-pink-600 shadow-glass-sm'
                  : 'text-gray-700 hover:glass-strong'
              }`}
            >
              Recent Activities
            </button>
          </div>

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 shadow-glass">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Key Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partner Universities
                    </label>
                    <input
                      type="number"
                      value={stats.partnerUniversities}
                      onChange={(e) => setStats({ ...stats, partnerUniversities: parseInt(e.target.value) || 0 })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active Agreements
                    </label>
                    <input
                      type="number"
                      value={stats.activeAgreements}
                      onChange={(e) => setStats({ ...stats, activeAgreements: parseInt(e.target.value) || 0 })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Exchanges
                    </label>
                    <input
                      type="number"
                      value={stats.studentExchanges}
                      onChange={(e) => setStats({ ...stats, studentExchanges: parseInt(e.target.value) || 0 })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Events This Year
                    </label>
                    <input
                      type="number"
                      value={stats.eventsThisYear}
                      onChange={(e) => setStats({ ...stats, eventsThisYear: parseInt(e.target.value) || 0 })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 shadow-glass">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Regional Distribution (%)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asia Pacific
                    </label>
                    <input
                      type="number"
                      value={stats.regionalDistribution.asiaPacific}
                      onChange={(e) => setStats({
                        ...stats,
                        regionalDistribution: {
                          ...stats.regionalDistribution,
                          asiaPacific: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Europe
                    </label>
                    <input
                      type="number"
                      value={stats.regionalDistribution.europe}
                      onChange={(e) => setStats({
                        ...stats,
                        regionalDistribution: {
                          ...stats.regionalDistribution,
                          europe: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Americas
                    </label>
                    <input
                      type="number"
                      value={stats.regionalDistribution.americas}
                      onChange={(e) => setStats({
                        ...stats,
                        regionalDistribution: {
                          ...stats.regionalDistribution,
                          americas: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 shadow-glass">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Programs Offered</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exchange Programs
                    </label>
                    <input
                      type="number"
                      value={stats.programsOffered.exchange}
                      onChange={(e) => setStats({
                        ...stats,
                        programsOffered: {
                          ...stats.programsOffered,
                          exchange: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Programs
                    </label>
                    <input
                      type="number"
                      value={stats.programsOffered.research}
                      onChange={(e) => setStats({
                        ...stats,
                        programsOffered: {
                          ...stats.programsOffered,
                          research: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Summer Programs
                    </label>
                    <input
                      type="number"
                      value={stats.programsOffered.summer}
                      onChange={(e) => setStats({
                        ...stats,
                        programsOffered: {
                          ...stats.programsOffered,
                          summer: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 shadow-glass">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Engagement Score</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (out of 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={stats.engagementScore}
                    onChange={(e) => setStats({ ...stats, engagementScore: parseFloat(e.target.value) || 0 })}
                    className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Partner Universities</h2>
                <button
                  onClick={handleAddPartner}
                  className="glass-strong px-5 py-2.5 rounded-xl font-semibold text-white gradient-pink hover:shadow-glass-lg transition-glass flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Partner
                </button>
              </div>

              {showPartnerForm && editingPartner && (
                <div className="glass-card rounded-3xl p-6 shadow-glass">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      {editingPartner.id && partners.find(p => p.id === editingPartner.id) ? 'Edit Partner' : 'Add New Partner'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowPartnerForm(false)
                        setEditingPartner(null)
                      }}
                      className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:glass-strong"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        value={editingPartner.name}
                        onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                        className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                        placeholder="University name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                      <input
                        type="text"
                        value={editingPartner.country}
                        onChange={(e) => setEditingPartner({ ...editingPartner, country: e.target.value })}
                        className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={editingPartner.city}
                        onChange={(e) => setEditingPartner({ ...editingPartner, city: e.target.value })}
                        className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={editingPartner.lat}
                        onChange={(e) => setEditingPartner({ ...editingPartner, lat: parseFloat(e.target.value) || 0 })}
                        className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                        placeholder="Latitude"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={editingPartner.lng}
                        onChange={(e) => setEditingPartner({ ...editingPartner, lng: parseFloat(e.target.value) || 0 })}
                        className="w-full glass px-4 py-2.5 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-pink-200/80"
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleSavePartner}
                      className="glass-strong px-6 py-2.5 rounded-xl font-semibold text-white gradient-pink hover:shadow-glass-lg transition-glass"
                    >
                      Save Partner
                    </button>
                    <button
                      onClick={() => {
                        setShowPartnerForm(false)
                        setEditingPartner(null)
                      }}
                      className="glass px-6 py-2.5 rounded-xl font-semibold text-gray-700 hover:glass-strong transition-glass"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="glass-card rounded-2xl p-5 shadow-glass">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{partner.name}</h4>
                        <p className="text-sm text-gray-600">{partner.city}, {partner.country}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPartner(partner)}
                          className="w-8 h-8 rounded-lg glass-card flex items-center justify-center hover:glass-strong transition-glass"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeletePartner(partner.id)}
                          className="w-8 h-8 rounded-lg glass-card flex items-center justify-center hover:glass-strong transition-glass"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
                <button
                  onClick={handleAddActivity}
                  className="glass-strong px-5 py-2.5 rounded-xl font-semibold text-white gradient-pink hover:shadow-glass-lg transition-glass flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Activity
                </button>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="glass-card rounded-2xl p-5 shadow-glass">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={activity.title}
                          onChange={async (e) => {
                            const updated = activities.map(a => a.id === activity.id ? { ...a, title: e.target.value } : a)
                            setActivities(updated)
                            // Auto-save if it's a database activity
                            if (typeof activity.id === 'number' && activity.id < 1000000000000 && activity.title) {
                              try {
                                await activitiesAPI.update(activity.id, {
                                  title: e.target.value,
                                  description: activity.description,
                                  date: activity.date
                                })
                              } catch (error) {
                                console.error('Error auto-saving activity:', error)
                              }
                            }
                          }}
                          className="w-full glass px-4 py-2 rounded-xl text-gray-800 font-semibold mb-2 outline-none focus:ring-2 focus:ring-pink-200/80"
                          placeholder="Activity title"
                        />
                        <textarea
                          value={activity.description}
                          onChange={async (e) => {
                            const updated = activities.map(a => a.id === activity.id ? { ...a, description: e.target.value } : a)
                            setActivities(updated)
                            // Auto-save if it's a database activity
                            if (typeof activity.id === 'number' && activity.id < 1000000000000 && activity.title) {
                              try {
                                await activitiesAPI.update(activity.id, {
                                  title: activity.title,
                                  description: e.target.value,
                                  date: activity.date
                                })
                              } catch (error) {
                                console.error('Error auto-saving activity:', error)
                              }
                            }
                          }}
                          className="w-full glass px-4 py-2 rounded-xl text-gray-600 text-sm mb-2 outline-none focus:ring-2 focus:ring-pink-200/80 resize-none"
                          rows="2"
                          placeholder="Activity description"
                        />
                        <input
                          type="text"
                          value={activity.date}
                          onChange={async (e) => {
                            const updated = activities.map(a => a.id === activity.id ? { ...a, date: e.target.value } : a)
                            setActivities(updated)
                            // Auto-save if it's a database activity
                            if (typeof activity.id === 'number' && activity.id < 1000000000000 && activity.title) {
                              try {
                                await activitiesAPI.update(activity.id, {
                                  title: activity.title,
                                  description: activity.description,
                                  date: e.target.value
                                })
                              } catch (error) {
                                console.error('Error auto-saving activity:', error)
                              }
                            }
                          }}
                          className="w-full glass px-4 py-2 rounded-xl text-gray-500 text-xs outline-none focus:ring-2 focus:ring-pink-200/80"
                          placeholder="Date"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:glass-strong transition-glass self-start"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

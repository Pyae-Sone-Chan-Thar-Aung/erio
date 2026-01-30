import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, change, trend, icon: Icon, color }) {
  return (
    <div className="glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-lg transition-glass group relative overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 gradient-pink-radial opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="w-14 h-14 rounded-2xl gradient-pink flex items-center justify-center shadow-glass-sm group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-white" />
          </div>
          {trend === 'up' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50/50 backdrop-blur-sm border border-green-200/50">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">{change}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50/50 backdrop-blur-sm border border-red-200/50">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">{change}</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2 tracking-wide">{title}</h3>
        <p className="text-4xl font-bold text-gray-800 tracking-tight">{value}</p>
      </div>
    </div>
  )
}

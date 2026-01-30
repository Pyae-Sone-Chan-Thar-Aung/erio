import { X, MapPin, Users, Calendar, GraduationCap, Globe } from 'lucide-react'

export default function PartnerDetails({ partner, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="glass-card rounded-3xl p-5 md:p-9 shadow-glass-lg max-w-2xl w-full mx-4 relative z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-11 h-11 rounded-full glass-card flex items-center justify-center hover:glass-strong transition-glass shadow-glass-sm"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl gradient-pink flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 break-words">{partner.name}</h2>
              <p className="text-sm md:text-base text-gray-600 flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span className="break-words">{partner.city}, {partner.country}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              University Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="font-semibold text-gray-800">{partner.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Partnership Since</p>
                <p className="font-semibold text-gray-800">{partner.established}</p>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Active Programs
            </h3>
            <div className="flex flex-wrap gap-2">
              {partner.programs.map((program, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-lg gradient-pink-soft text-pink-700 text-sm font-medium"
                >
                  {program}
                </span>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Exchange Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg gradient-pink-soft">
                <div className="text-3xl font-bold text-pink-700 mb-1">{partner.students}</div>
                <div className="text-sm text-pink-600">Active Students</div>
              </div>
              <div className="text-center p-4 rounded-lg gradient-pink-soft">
                <div className="text-3xl font-bold text-pink-700 mb-1">{partner.programs.length}</div>
                <div className="text-sm text-pink-600">Programs</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-6 py-3 rounded-xl gradient-pink text-white font-semibold hover:opacity-90 transition-all">
              View Full Profile
            </button>
            <button className="px-6 py-3 rounded-xl glass text-gray-700 font-semibold hover:glass-strong transition-all">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

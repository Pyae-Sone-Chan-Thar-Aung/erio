// Supabase API Service for ERIO Dashboard
import { supabase } from '../lib/supabase'

// Read admin env vars once and expose presence for debugging
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
// Do not log the actual values; only log whether they're set
console.debug('ENV_DEBUG: VITE_ADMIN_EMAIL set?', !!ADMIN_EMAIL, 'VITE_ADMIN_PASSWORD set?', !!ADMIN_PASSWORD)

// Auth API using Supabase
export const authAPI = {
  login: async (email, password) => {
    try {
      // Try server-side RPC auth first (safer: password check happens in DB)
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('admin_auth', {
          p_email: email,
          p_password: password
        })
        console.debug('AUTH_DEBUG: rpc admin_auth returned?', !!rpcData, 'error?', !!rpcError)
        if (!rpcError && rpcData && (Array.isArray(rpcData) ? rpcData.length > 0 : true)) {
          const rpcAdmin = Array.isArray(rpcData) ? rpcData[0] : rpcData

          // Update last login
          try {
            await supabase
              .from('admin_users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', rpcAdmin.id)
          } catch (e) {
            console.debug('AUTH_DEBUG: failed to update last_login (non-fatal)')
          }

          // Store admin session
          localStorage.setItem('adminToken', 'authenticated')
          localStorage.setItem('adminEmail', rpcAdmin.email)
          localStorage.setItem('adminId', rpcAdmin.id)
          localStorage.setItem('adminAuthenticated', 'true')
          localStorage.setItem('adminLoginTime', Date.now().toString())

          return {
            success: true,
            admin: {
              id: rpcAdmin.id,
              email: rpcAdmin.email
            }
          }
        }
      } catch (rpcErr) {
        // If RPC fails or doesn't exist, continue to existing fallback flow
        console.debug('AUTH_DEBUG: rpc call failed or not available, continuing to fallback flow')
      }

      // Check if the user exists in admin_users table
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      // Debug: report whether DB query returned a user (no secrets logged)
      console.debug('AUTH_DEBUG: admin query returned user?', !!admin, 'error?', !!adminError, 'queriedEmail:', email)

      // If Supabase query fails (database not set up), fallback to environment variables
      if (adminError || !admin) {
        console.debug('AUTH_DEBUG: using env fallback (no DB admin found)')
        // Fallback: Check admin credentials from environment variables
        const adminEmail = ADMIN_EMAIL
        const adminPassword = ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
          throw new Error('Admin credentials not configured. Please set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in your .env file.')
        }

        if ((email === adminEmail || email === 'admin') && password === adminPassword) {
          // Store admin session (fallback mode)
          localStorage.setItem('adminToken', 'authenticated')
          localStorage.setItem('adminEmail', email)
          localStorage.setItem('adminId', 'fallback')
          localStorage.setItem('adminAuthenticated', 'true')
          localStorage.setItem('adminLoginTime', Date.now().toString())

          return {
            success: true,
            admin: {
              id: 'fallback',
              email: email
            }
          }
        }

        throw new Error('Invalid email or password')
      }

      // Verify password (currently stored as plain text - in production, use proper hashing)
      // For now, compare directly - in production, use bcrypt or Supabase Auth
      console.debug('AUTH_DEBUG: DB admin found, has password hash?', !!admin.password_hash)
      if (admin.password_hash !== password) {
        console.debug('AUTH_DEBUG: DB password mismatch for admin id', admin && admin.id)

        // If DB password mismatches, allow login if provided credentials match
        // the local environment fallback. This helps recover access when the
        // DB-stored password differs from your intended local admin password.
        // Do NOT log secret values.
        const envEmail = ADMIN_EMAIL
        const envPassword = ADMIN_PASSWORD
        const matchesEnvFallback = envEmail && envPassword && ((email === envEmail) || email === 'admin') && password === envPassword

        if (matchesEnvFallback) {
          console.debug('AUTH_DEBUG: credentials match env fallback — granting access and syncing DB')
          // Attempt to upsert the admin row so future logins use the DB value.
          try {
            const targetEmail = (email === 'admin') ? envEmail : email
            // Use upsert: if admin exists update its password_hash, else insert new
            await supabase
              .from('admin_users')
              .upsert({ email: targetEmail, password_hash: envPassword }, { onConflict: 'email' })
          } catch (syncErr) {
            console.debug('AUTH_DEBUG: failed to sync admin row to DB (non-fatal)')
          }

          // Store admin session (fallback mode)
          localStorage.setItem('adminToken', 'authenticated')
          localStorage.setItem('adminEmail', email)
          localStorage.setItem('adminId', admin.id || 'fallback')
          localStorage.setItem('adminAuthenticated', 'true')
          localStorage.setItem('adminLoginTime', Date.now().toString())

          return {
            success: true,
            admin: {
              id: admin.id || 'fallback',
              email: email
            }
          }
        }

        throw new Error('Invalid email or password')
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id)

      // Store admin session
      localStorage.setItem('adminToken', 'authenticated')
      localStorage.setItem('adminEmail', admin.email)
      localStorage.setItem('adminId', admin.id)
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('adminLoginTime', Date.now().toString())

      return {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Invalid email or password')
    }
  },

  verify: async () => {
    const adminId = localStorage.getItem('adminId')
    if (!adminId) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('id', adminId)
      .single()

    if (error || !data) {
      throw new Error('Invalid session')
    }

    return { valid: true, admin: data }
  },

  logout: () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('adminId')
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
  }
}

// Dashboard Stats API
export const dashboardAPI = {
  getStats: async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      if (!data) {
        // Return default stats if none exist
        return {
          partnerUniversities: 76,
          activeAgreements: 65,
          studentExchanges: 892,
          eventsThisYear: 32,
          regionalDistribution: { asiaPacific: 88, europe: 7, americas: 5 },
          programsOffered: { exchange: 68, research: 24, summer: 18 },
          engagementScore: 9.2
        }
      }

      return {
        partnerUniversities: data.partner_universities,
        activeAgreements: data.active_agreements,
        studentExchanges: data.student_exchanges,
        eventsThisYear: data.events_this_year,
        regionalDistribution: typeof data.regional_distribution === 'string'
          ? JSON.parse(data.regional_distribution)
          : data.regional_distribution,
        programsOffered: typeof data.programs_offered === 'string'
          ? JSON.parse(data.programs_offered)
          : data.programs_offered,
        engagementScore: parseFloat(data.engagement_score)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  },

  updateStats: async (stats) => {
    try {
      const adminId = localStorage.getItem('adminId')
      if (!adminId) {
        throw new Error('Not authenticated')
      }

      // Check if stats exist
      const { data: existing } = await supabase
        .from('dashboard_stats')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      const statsData = {
        partner_universities: stats.partnerUniversities,
        active_agreements: stats.activeAgreements,
        student_exchanges: stats.studentExchanges,
        events_this_year: stats.eventsThisYear,
        regional_distribution: stats.regionalDistribution,
        programs_offered: stats.programsOffered,
        engagement_score: stats.engagementScore,
        updated_at: new Date().toISOString()
      }

      let result
      if (existing) {
        // Update existing
        result = await supabase
          .from('dashboard_stats')
          .update(statsData)
          .eq('id', existing.id)
          .select()
          .single()
      } else {
        // Insert new
        result = await supabase
          .from('dashboard_stats')
          .insert(statsData)
          .select()
          .single()
      }

      if (result.error) {
        throw result.error
      }

      return { success: true, message: 'Stats updated successfully' }
    } catch (error) {
      console.error('Error updating stats:', error)
      throw error
    }
  }
}

// Partners API
export const partnersAPI = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('partner_universities')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        throw error
      }

      return data.map(partner => ({
        id: partner.id,
        name: partner.name,
        country: partner.country,
        city: partner.city || '',
        lat: parseFloat(partner.lat) || 0,
        lng: parseFloat(partner.lng) || 0,
        students: partner.students || 0,
        programs: partner.programs || ['Student Exchange'],
        established: partner.established || '',
        type: partner.type || 'Comprehensive'
      }))
    } catch (error) {
      console.error('Error fetching partners:', error)
      throw error
    }
  },

  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('partner_universities')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        country: data.country,
        city: data.city || '',
        lat: parseFloat(data.lat) || 0,
        lng: parseFloat(data.lng) || 0,
        students: data.students || 0,
        programs: data.programs || ['Student Exchange'],
        established: data.established || '',
        type: data.type || 'Comprehensive'
      }
    } catch (error) {
      console.error('Error fetching partner:', error)
      throw error
    }
  },

  create: async (partner) => {
    try {
      const adminId = localStorage.getItem('adminId')
      if (!adminId) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('partner_universities')
        .insert({
          name: partner.name,
          country: partner.country,
          city: partner.city || null,
          lat: partner.lat || null,
          lng: partner.lng || null,
          students: partner.students || 0,
          programs: partner.programs || ['Student Exchange'],
          established: partner.established || null,
          type: partner.type || 'Comprehensive'
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        country: data.country,
        city: data.city || '',
        lat: parseFloat(data.lat) || 0,
        lng: parseFloat(data.lng) || 0,
        students: data.students || 0,
        programs: data.programs || ['Student Exchange'],
        established: data.established || '',
        type: data.type || 'Comprehensive'
      }
    } catch (error) {
      console.error('Error creating partner:', error)
      throw error
    }
  },

  update: async (id, partner) => {
    try {
      const adminId = localStorage.getItem('adminId')
      if (!adminId) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('partner_universities')
        .update({
          name: partner.name,
          country: partner.country,
          city: partner.city || null,
          lat: partner.lat || null,
          lng: partner.lng || null,
          students: partner.students || 0,
          programs: partner.programs || ['Student Exchange'],
          established: partner.established || null,
          type: partner.type || 'Comprehensive',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        country: data.country,
        city: data.city || '',
        lat: parseFloat(data.lat) || 0,
        lng: parseFloat(data.lng) || 0,
        students: data.students || 0,
        programs: data.programs || ['Student Exchange'],
        established: data.established || '',
        type: data.type || 'Comprehensive'
      }
    } catch (error) {
      console.error('Error updating partner:', error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const adminId = localStorage.getItem('adminId')
      if (!adminId) {
        throw new Error('Not authenticated')
      }

      const { error } = await supabase
        .from('partner_universities')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return { success: true, message: 'Partner deleted successfully' }
    } catch (error) {
      console.error('Error deleting partner:', error)
      throw error
    }
  }
}

// Activities API
export const activitiesAPI = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('recent_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        throw error
      }

      return data.map(activity => ({
        id: activity.id,
        title: activity.title,
        description: activity.description || '',
        date: activity.date || new Date(activity.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }))
    } catch (error) {
      console.error('Error fetching activities:', error)
      throw error
    }
  },

  create: async (activity) => {
    try {
      const adminId = localStorage.getItem('adminId')
      if (!adminId) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('recent_activities')
        .insert({
          title: activity.title,
          description: activity.description || null,
          date: activity.date || null
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        date: data.date || new Date(data.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    } catch (error) {
      console.error('Error creating activity:', error)
      throw error
    }
  },

  update: async (id, activity) => {
    try {
      const adminId = localStorage.getItem('adminId')
      if (!adminId) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('recent_activities')
        .update({
          title: activity.title,
          description: activity.description || null,
          date: activity.date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        date: data.date || new Date(data.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    } catch (error) {
      console.error('Error updating activity:', error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const adminId = localStorage.getItem('adminId')
      if (!adminId) {
        throw new Error('Not authenticated')
      }

      const { error } = await supabase
        .from('recent_activities')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return { success: true, message: 'Activity deleted successfully' }
    } catch (error) {
      console.error('Error deleting activity:', error)
      throw error
    }
  }
}

// Website View Counter API
export const viewCounterAPI = {
  incrementView: async () => {
    try {
      // Generate a unique session ID stored in localStorage
      let sessionId = localStorage.getItem('viewerSessionId')
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('viewerSessionId', sessionId)
      }

      // Check if this session already recorded a view today
      const today = new Date().toISOString().split('T')[0]
      const lastViewKey = `lastViewDate_${sessionId}`
      const lastViewDate = localStorage.getItem(lastViewKey)

      // Only increment if this is a new day or first visit
      if (lastViewDate !== today) {
        const { data, error } = await supabase
          .from('website_views')
          .insert({
            session_id: sessionId,
            view_date: today,
            timestamp: new Date().toISOString()
          })
          .select()
          .single()

        if (!error && data) {
          // Record that we viewed today
          localStorage.setItem(lastViewKey, today)
          return data
        }
      }

      return null
    } catch (error) {
      console.error('Error in incrementView:', error)
      return null
    }
  },

  getTotalViews: async () => {
    try {
      // Use distinct count to get unique session_ids
      const { data, error, count } = await supabase
        .from('website_views')
        .select('session_id', { count: 'exact' })

      if (error) {
        console.error('Error fetching total views:', error)
        return 0
      }

      if (!data || data.length === 0) {
        console.debug('No view records found')
        return 0
      }

      // Count unique session IDs
      const uniqueSessions = new Set(data.map(row => row.session_id))
      const totalViews = uniqueSessions.size
      console.debug('Total unique views:', totalViews, 'from', data.length, 'records')
      return totalViews
    } catch (error) {
      console.error('Error in getTotalViews:', error)
      return 0
    }
  }
}

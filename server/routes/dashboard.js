import express from 'express'
import pool from '../config/database.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get dashboard stats (public)
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM dashboard_stats ORDER BY updated_at DESC LIMIT 1'
    )
    
    if (result.rows.length === 0) {
      // Return default stats if none exist
      return res.json({
        partnerUniversities: 76,
        activeAgreements: 65,
        studentExchanges: 892,
        eventsThisYear: 32,
        regionalDistribution: { asiaPacific: 88, europe: 7, americas: 5 },
        programsOffered: { exchange: 68, research: 24, summer: 18 },
        engagementScore: 9.2
      })
    }
    
    const stats = result.rows[0]
    res.json({
      partnerUniversities: stats.partner_universities,
      activeAgreements: stats.active_agreements,
      studentExchanges: stats.student_exchanges,
      eventsThisYear: stats.events_this_year,
      regionalDistribution: stats.regional_distribution,
      programsOffered: stats.programs_offered,
      engagementScore: parseFloat(stats.engagement_score)
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update dashboard stats (admin only)
router.put('/stats', authenticateAdmin, async (req, res) => {
  try {
    const {
      partnerUniversities,
      activeAgreements,
      studentExchanges,
      eventsThisYear,
      regionalDistribution,
      programsOffered,
      engagementScore
    } = req.body
    
    await pool.query(
      `UPDATE dashboard_stats 
       SET partner_universities = $1,
           active_agreements = $2,
           student_exchanges = $3,
           events_this_year = $4,
           regional_distribution = $5,
           programs_offered = $6,
           engagement_score = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = (SELECT id FROM dashboard_stats ORDER BY updated_at DESC LIMIT 1)
       RETURNING *`,
      [
        partnerUniversities,
        activeAgreements,
        studentExchanges,
        eventsThisYear,
        JSON.stringify(regionalDistribution),
        JSON.stringify(programsOffered),
        engagementScore
      ]
    )
    
    res.json({ success: true, message: 'Stats updated successfully' })
  } catch (error) {
    console.error('Error updating stats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

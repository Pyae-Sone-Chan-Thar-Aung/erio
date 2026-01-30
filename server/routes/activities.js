import express from 'express'
import pool from '../config/database.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all activities (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recent_activities ORDER BY created_at DESC LIMIT 10'
    )
    
    const activities = result.rows.map(activity => ({
      id: activity.id,
      title: activity.title,
      description: activity.description || '',
      date: activity.date || new Date(activity.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }))
    
    res.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create activity (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, date } = req.body
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    const result = await pool.query(
      `INSERT INTO recent_activities (title, description, date)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description || null, date || null]
    )
    
    const activity = result.rows[0]
    res.status(201).json({
      id: activity.id,
      title: activity.title,
      description: activity.description || '',
      date: activity.date || new Date(activity.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })
  } catch (error) {
    console.error('Error creating activity:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update activity (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, date } = req.body
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    const result = await pool.query(
      `UPDATE recent_activities 
       SET title = $1, description = $2, date = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [title, description || null, date || null, req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' })
    }
    
    const activity = result.rows[0]
    res.json({
      id: activity.id,
      title: activity.title,
      description: activity.description || '',
      date: activity.date || new Date(activity.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })
  } catch (error) {
    console.error('Error updating activity:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete activity (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM recent_activities WHERE id = $1 RETURNING id',
      [req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' })
    }
    
    res.json({ success: true, message: 'Activity deleted successfully' })
  } catch (error) {
    console.error('Error deleting activity:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

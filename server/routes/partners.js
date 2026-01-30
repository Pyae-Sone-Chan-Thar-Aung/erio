import express from 'express'
import pool from '../config/database.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all partners (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM partner_universities ORDER BY name ASC'
    )
    
    const partners = result.rows.map(partner => ({
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
    
    res.json(partners)
  } catch (error) {
    console.error('Error fetching partners:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single partner (public)
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM partner_universities WHERE id = $1',
      [req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' })
    }
    
    const partner = result.rows[0]
    res.json({
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
    })
  } catch (error) {
    console.error('Error fetching partner:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create partner (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, country, city, lat, lng, students, programs, established, type } = req.body
    
    if (!name || !country) {
      return res.status(400).json({ error: 'Name and country are required' })
    }
    
    const result = await pool.query(
      `INSERT INTO partner_universities 
       (name, country, city, lat, lng, students, programs, established, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        name,
        country,
        city || null,
        lat || null,
        lng || null,
        students || 0,
        programs || ['Student Exchange'],
        established || null,
        type || 'Comprehensive'
      ]
    )
    
    const partner = result.rows[0]
    res.status(201).json({
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
    })
  } catch (error) {
    console.error('Error creating partner:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update partner (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, country, city, lat, lng, students, programs, established, type } = req.body
    
    if (!name || !country) {
      return res.status(400).json({ error: 'Name and country are required' })
    }
    
    const result = await pool.query(
      `UPDATE partner_universities 
       SET name = $1, country = $2, city = $3, lat = $4, lng = $5,
           students = $6, programs = $7, established = $8, type = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        name,
        country,
        city || null,
        lat || null,
        lng || null,
        students || 0,
        programs || ['Student Exchange'],
        established || null,
        type || 'Comprehensive',
        req.params.id
      ]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' })
    }
    
    const partner = result.rows[0]
    res.json({
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
    })
  } catch (error) {
    console.error('Error updating partner:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete partner (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM partner_universities WHERE id = $1 RETURNING id',
      [req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' })
    }
    
    res.json({ success: true, message: 'Partner deleted successfully' })
  } catch (error) {
    console.error('Error deleting partner:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

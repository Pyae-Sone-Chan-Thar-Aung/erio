import pg from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'erio_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
})

async function initDatabase() {
  try {
    console.log('Connecting to database...')
    
    // Read and execute schema
    const fs = await import('fs')
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    await pool.query(schema)
    console.log('Database schema created successfully')
    
    // Hash and insert admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'paung_230000001724@uic.edu.ph'
    const adminPassword = process.env.ADMIN_PASSWORD || 'erio2026pass!'
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    
    await pool.query(
      `INSERT INTO admin_users (email, password_hash) 
       VALUES ($1, $2) 
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [adminEmail, passwordHash]
    )
    console.log('Admin user initialized')
    
    console.log('Database initialization complete!')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  }
}

initDatabase()

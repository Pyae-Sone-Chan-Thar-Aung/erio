# ERIO Dashboard Backend Server

Backend API server for the ERIO Dashboard application using Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up PostgreSQL Database

1. Install PostgreSQL if you haven't already
2. Create a new database:
   ```sql
   CREATE DATABASE erio_dashboard;
   ```

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=erio_dashboard
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   PORT=3001
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ADMIN_EMAIL=paung_230000001724@uic.edu.ph
   ADMIN_PASSWORD=erio2026pass!
   ```

### 4. Initialize Database

Run the initialization script to create tables and set up the admin user:

```bash
node database/init.js
```

Or manually run the SQL schema:

```bash
psql -U postgres -d erio_dashboard -f database/schema.sql
```

### 5. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3001` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Dashboard Stats
- `GET /api/dashboard/stats` - Get dashboard statistics (public)
- `PUT /api/dashboard/stats` - Update dashboard statistics (admin only)

### Partners
- `GET /api/partners` - Get all partners (public)
- `GET /api/partners/:id` - Get single partner (public)
- `POST /api/partners` - Create partner (admin only)
- `PUT /api/partners/:id` - Update partner (admin only)
- `DELETE /api/partners/:id` - Delete partner (admin only)

### Activities
- `GET /api/activities` - Get all activities (public)
- `POST /api/activities` - Create activity (admin only)
- `PUT /api/activities/:id` - Update activity (admin only)
- `DELETE /api/activities/:id` - Delete activity (admin only)

## Authentication

Admin routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is obtained by logging in via `/api/auth/login` and is valid for 24 hours.

## Database Schema

- `dashboard_stats` - Stores dashboard statistics
- `partner_universities` - Stores partner university information
- `recent_activities` - Stores recent activity/news items
- `admin_users` - Stores admin user accounts

## Security Notes

- Change `JWT_SECRET` in production
- Use strong database passwords
- Enable SSL for PostgreSQL in production
- Consider rate limiting for API endpoints
- Use environment variables for all sensitive data

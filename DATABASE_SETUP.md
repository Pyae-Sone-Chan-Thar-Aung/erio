# Database Setup Guide for ERIO Dashboard

This guide will help you set up the PostgreSQL database for the ERIO Dashboard application.

## Prerequisites

1. **PostgreSQL** installed on your system (version 12 or higher)
   - Download from: https://www.postgresql.org/download/
   - Or use a cloud service like:
     - AWS RDS
     - Google Cloud SQL
     - Azure Database for PostgreSQL
     - Supabase (free tier available)
     - ElephantSQL (free tier available)

2. **Node.js** installed (v18 or higher)

## Step-by-Step Setup

### Option 1: Local PostgreSQL Installation

#### 1. Install PostgreSQL

**Windows:**
- Download PostgreSQL installer from https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Remember the password you set for the `postgres` user

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### 2. Create Database

Open PostgreSQL command line (psql) or pgAdmin:

```sql
CREATE DATABASE erio_dashboard;
```

Or via command line:
```bash
psql -U postgres -c "CREATE DATABASE erio_dashboard;"
```

#### 3. Configure Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=erio_dashboard
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   PORT=3001
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ADMIN_EMAIL=paung_230000001724@uic.edu.ph
   ADMIN_PASSWORD=erio2026pass!
   ```

#### 4. Install Backend Dependencies

```bash
cd server
npm install
```

#### 5. Initialize Database

Run the initialization script:
```bash
node database/init.js
```

This will:
- Create all necessary tables
- Set up the admin user with hashed password
- Insert default dashboard statistics

### Option 2: Cloud Database (Recommended for Production)

#### Using Supabase (Free Tier Available)

1. Go to https://supabase.com and create an account
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string
5. Update your `.env` file:
   ```env
   DB_HOST=db.your-project.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_supabase_password
   ```
6. Run the initialization script: `node database/init.js`

#### Using ElephantSQL (Free Tier Available)

1. Go to https://www.elephantsql.com and sign up
2. Create a new instance (select the free "Tiny Turtle" plan)
3. Copy the connection details
4. Update your `.env` file with the provided credentials
5. Run the initialization script: `node database/init.js`

## Starting the Application

### 1. Start the Backend Server

```bash
cd server
npm run dev
```

The server should start on `http://localhost:3001`

### 2. Start the Frontend

In a new terminal:

```bash
npm run dev
```

The frontend should start on `http://localhost:5173`

### 3. Configure Frontend API URL (Optional)

If your backend is running on a different URL, create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## Verifying the Setup

1. **Check Database Connection:**
   - Visit `http://localhost:3001/health` - should return `{ status: 'ok' }`

2. **Test Admin Login:**
   - Go to `http://localhost:5173/admin/login`
   - Login with:
     - Email: `paung_230000001724@uic.edu.ph`
     - Password: `erio2026pass!`

3. **Check Database Tables:**
   ```sql
   \dt  -- List all tables in psql
   ```

## Troubleshooting

### Connection Refused Error

- Make sure PostgreSQL is running
- Check that the port in `.env` matches your PostgreSQL port (default: 5432)
- Verify firewall settings allow connections

### Authentication Failed

- Double-check your database username and password in `.env`
- For local installations, ensure the `postgres` user password is correct

### Table Already Exists Error

- The tables might already exist. This is okay - the script uses `CREATE TABLE IF NOT EXISTS`
- If you need to reset, you can drop and recreate:
  ```sql
  DROP DATABASE erio_dashboard;
  CREATE DATABASE erio_dashboard;
  ```
  Then run `node database/init.js` again

### Port Already in Use

- Change the `PORT` in `server/.env` to a different port (e.g., 3002)
- Update `VITE_API_URL` in the frontend `.env` accordingly

## Production Deployment

For production:

1. **Use Environment Variables:**
   - Never commit `.env` files
   - Use your hosting platform's environment variable settings

2. **Secure JWT Secret:**
   - Generate a strong random string for `JWT_SECRET`
   - Use at least 32 characters

3. **Database Security:**
   - Use SSL connections for database
   - Restrict database access to your server IP only
   - Use strong database passwords

4. **CORS Configuration:**
   - Update `FRONTEND_URL` in `server/.env` to your production frontend URL

## Need Help?

If you encounter issues:
1. Check the server console for error messages
2. Verify database connection with: `psql -U postgres -d erio_dashboard`
3. Check that all environment variables are set correctly
4. Ensure PostgreSQL is running and accessible

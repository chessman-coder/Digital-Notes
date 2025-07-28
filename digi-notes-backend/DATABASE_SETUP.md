# Database Setup Guide for Digi Notes

## Database Connection Status ✅

Your database connection has been successfully configured and tested!

## Configuration Details

- **Database Host**: localhost
- **Database User**: root
- **Database Password**: Poleak171717
- **Database Name**: digi_notes
- **Server Port**: 5001

## Files Created/Updated

1. **`.env`** - Environment configuration file with your database credentials
2. **`test-db-connection.js`** - Database connection test script
3. **`scripts/safe-init-db.sql`** - Safe database initialization script
4. **`scripts/complete-init-db.sql`** - Complete database setup script

## Current Database Status

✅ **Connection**: Successfully connected to MySQL server
✅ **Database**: `digi_notes` database exists
✅ **Tables**: The following tables are already set up:
   - `users` - User accounts and profiles
   - `notes` - User notes and content
   - `folders` - Note organization folders
   - `tags` - Note tagging system

## How to Use

### 1. Start the Backend Server
```bash
cd digi-notes-backend
npm run dev
```
The server will run on `http://localhost:5001` with auto-restart on file changes (using nodemon)

**Alternative (without auto-restart):**
```bash
cd digi-notes-backend
node server.js
```

### 2. Test Database Connection
```bash
cd digi-notes-backend
node test-db-connection.js
```

### 3. API Endpoints Available
- `GET /api/health` - Server health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create new note
- `GET /api/folders` - Get user folders
- `POST /api/folders` - Create new folder
- `GET /api/tags` - Get user tags
- `POST /api/tags` - Create new tag

### 4. Frontend Configuration
Make sure your frontend is configured to connect to:
```
Backend URL: http://localhost:5001
```

## Database Schema

The database includes the following main tables:

### Users Table
- `id` - Primary key
- `username` - User display name
- `email` - Unique email address
- `password` - Hashed password
- `profile_pic` - Profile picture URL
- `createdAt`, `updatedAt` - Timestamps

### Notes Table
- `id` - Primary key
- `title` - Note title
- `content` - Note content
- `userId` - Foreign key to users
- `folderId` - Foreign key to folders (optional)
- `isPinned` - Pin status
- `isArchived` - Archive status
- `createdAt`, `updatedAt` - Timestamps

### Folders Table
- `id` - Primary key
- `name` - Folder name
- `color` - Folder color theme
- `userId` - Foreign key to users
- `createdAt`, `updatedAt` - Timestamps

### Tags Table
- `id` - Primary key
- `name` - Tag name
- `userId` - Foreign key to users
- `createdAt` - Timestamp

## Troubleshooting

If you encounter any issues:

1. **Connection Refused**: Make sure MySQL server is running
2. **Access Denied**: Check username/password in `.env` file
3. **Database Not Found**: Run the initialization script
4. **Port Already in Use**: Change the PORT in `.env` file

## Security Notes

- The `.env` file contains sensitive information and should not be committed to version control
- Make sure to use strong passwords in production
- Consider using environment-specific configuration files

---

🎉 **Your database is now ready to use!**
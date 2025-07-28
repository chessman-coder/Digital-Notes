# Digital Journal - Full Stack Application

A modern, full-stack digital notes application with React frontend and Node.js/Express backend, featuring real-time synchronization, user authentication, and comprehensive note management.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI**: Built with React, Tailwind CSS, and ShadCN UI components
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant synchronization with backend API
- **Rich Text Editing**: Advanced note editor with formatting support
- **Smart Organization**: Folders, tags, and search functionality
- **Authentication**: Secure JWT-based user authentication

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for notes, folders, and tags
- **MySQL Database**: Robust data persistence with relational structure
- **JWT Authentication**: Secure user authentication and authorization
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Digital-Notes
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd digi-notes-backend
npm install
```

#### Database Setup
1. Create a MySQL database named `digi_notes`
2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=digi_notes

JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:8080
```

#### Start Backend Server
```bash
npm run dev
```
The backend will run on `http://localhost:3001`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../digi-notes
npm install
```

#### Environment Configuration
1. Copy environment variables:
```bash
cp .env.example .env
```

2. Update `.env` file:
```env
VITE_API_URL=http://localhost:3001/api

```

#### Start Frontend Development Server
```bash
npm run dev
```
The frontend will run on `http://localhost:8080`

## 🗄️ Database Schema

The application uses the following database structure:

### Tables
- **users**: User accounts and authentication
- **folders**: User-created folders for organizing notes
- **notes**: Individual notes with content and metadata
- **tags**: User-created tags for categorizing notes
- **note_tags**: Junction table for many-to-many note-tag relationships

### Key Features
- **Foreign Key Constraints**: Ensures data integrity
- **Indexes**: Optimized for performance
- **Cascading Deletes**: Automatic cleanup of related data

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Notes
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PATCH /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/pin` - Toggle pin status
- `PATCH /api/notes/:id/archive` - Toggle archive status

### Folders
- `GET /api/folders` - Get all user folders
- `POST /api/folders` - Create new folder
- `PATCH /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

### Tags
- `GET /api/tags` - Get all user tags
- `GET /api/tags/popular` - Get popular tags
- `POST /api/tags` - Create new tag
- `DELETE /api/tags/:id` - Delete tag

## 🔐 Authentication Flow

1. **Registration/Login**: User creates account or logs in
2. **JWT Token**: Server returns JWT token upon successful authentication
3. **Token Storage**: Frontend stores token in localStorage
4. **Authenticated Requests**: All API requests include JWT token in Authorization header
5. **Auto-logout**: Invalid/expired tokens trigger automatic logout

## 🎨 Frontend Architecture

### Key Components
- **AuthScreen**: Handles user registration and login
- **Index**: Main application container with state management
- **NoteEditor**: Rich text editor for creating/editing notes
- **NotesGrid**: Grid view of all notes with filtering
- **AppSidebar**: Navigation sidebar with folders and tags

### State Management
- **React Hooks**: useState and useEffect for local state
- **API Client**: Centralized API communication layer
- **Error Handling**: Global error handling with user feedback

## 🔧 Development

### Backend Development
```bash
cd digi-notes-backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd digi-notes
npm run dev  # Vite dev server with hot reload
```

### Building for Production

#### Backend
```bash
npm start  # Production server
```

#### Frontend
```bash
npm run build  # Creates dist/ folder
npm run preview  # Preview production build
```

## 🚀 Deployment

### Backend Deployment
1. Set up MySQL database on production server
2. Update environment variables for production
3. Run database initialization script
4. Deploy using PM2, Docker, or your preferred method

### Frontend Deployment
1. Update `VITE_API_URL` to production backend URL
2. Build the application: `npm run build`
3. Deploy `dist/` folder to static hosting (Netlify, Vercel, etc.)

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `digi_notes` exists

#### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check API URL in frontend `.env`

#### Authentication Issues
- Clear localStorage and try logging in again
- Verify JWT_SECRET is set in backend `.env`

#### API Connection Failed
- Ensure backend server is running on correct port
- Check network connectivity between frontend and backend

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy note-taking! 📝✨**
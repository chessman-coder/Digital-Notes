require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const { initializeTables } = require('./models/initTables');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const userRoutes = require('./routes/users');
const folderRoutes = require('./routes/folders');
const tagRoutes = require('./routes/tags');
const errorHandler = require('./utils/error');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Database connection check and table initialization
async function initializeDatabase() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
    
    // Initialize tables automatically
    await initializeTables();
    
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1); // Exit if database setup fails
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/tags', tagRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.BE_PORT || 1412;

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
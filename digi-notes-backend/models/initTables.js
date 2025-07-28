const pool = require('../config/db');

const createTablesSQL = {
    users: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      profile_pic VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,

    folders: `
    CREATE TABLE IF NOT EXISTS folders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      color VARCHAR(50) DEFAULT 'bg-gray-500',
      userId INT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_folders_user (userId)
    )
  `,

    tags: `
    CREATE TABLE IF NOT EXISTS tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      userId INT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_tag (userId, name),
      INDEX idx_tags_user (userId)
    )
  `,

    notes: `
    CREATE TABLE IF NOT EXISTS notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      userId INT NOT NULL,
      folderId INT,
      isPinned BOOLEAN DEFAULT FALSE,
      isArchived BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE SET NULL,
      INDEX idx_notes_user (userId),
      INDEX idx_notes_folder (folderId),
      INDEX idx_notes_pinned (isPinned),
      INDEX idx_notes_archived (isArchived),
      INDEX idx_notes_user_updated (userId, updatedAt DESC),
      INDEX idx_notes_user_pinned (userId, isPinned DESC, updatedAt DESC)
    )
  `,

    note_tags: `
    CREATE TABLE IF NOT EXISTS note_tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      noteId INT NOT NULL,
      tagId INT NOT NULL,
      FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE,
      UNIQUE KEY unique_note_tag (noteId, tagId),
      INDEX idx_note_tags_note (noteId),
      INDEX idx_note_tags_tag (tagId)
    )
  `
};

async function initializeTables() {
    const connection = await pool.getConnection();

    try {
        console.log('🔧 Initializing database tables...');

        // Create tables in the correct order (respecting foreign key dependencies)
        const tableOrder = ['users', 'folders', 'tags', 'notes', 'note_tags'];

        for (const tableName of tableOrder) {
            try {
                await connection.execute(createTablesSQL[tableName]);
                console.log(`✅ Table '${tableName}' ready`);
            } catch (error) {
                // Handle specific errors gracefully
                if (error.code === 'ER_DUP_KEYNAME') {
                    console.log(`ℹ️  Table '${tableName}' already exists with indexes`);
                } else if (error.code === 'ER_TABLE_EXISTS_ERROR') {
                    console.log(`ℹ️  Table '${tableName}' already exists`);
                } else {
                    console.error(`❌ Error creating table '${tableName}':`, error.message);
                    throw error;
                }
            }
        }

        console.log('🎉 Database tables initialization completed successfully!');

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

async function checkTablesExist() {
    const connection = await pool.getConnection();

    try {
        const [tables] = await connection.query('SHOW TABLES');
        const tableNames = tables.map(table => Object.values(table)[0]);

        const requiredTables = ['users', 'folders', 'tags', 'notes', 'note_tags'];
        const missingTables = requiredTables.filter(table => !tableNames.includes(table));

        if (missingTables.length > 0) {
            console.log(`📋 Missing tables detected: ${missingTables.join(', ')}`);
            return false;
        }

        console.log('✅ All required tables exist');
        return true;

    } catch (error) {
        console.error('❌ Error checking tables:', error.message);
        return false;
    } finally {
        connection.release();
    }
}

module.exports = {
    initializeTables,
    checkTablesExist
};
const pool = require('../config/db');

class Note {
  static async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT n.*, f.name as folderName, f.color as folderColor,
       GROUP_CONCAT(t.name) as tags
       FROM notes n
       LEFT JOIN folders f ON n.folderId = f.id
       LEFT JOIN note_tags nt ON n.id = nt.noteId
       LEFT JOIN tags t ON nt.tagId = t.id
       WHERE n.userId = ?
       GROUP BY n.id
       ORDER BY n.isPinned DESC, n.updatedAt DESC`,
      [userId]
    );
    
    // Process tags from comma-separated string to array
    return rows.map(note => ({
      ...note,
      tags: note.tags ? note.tags.split(',') : []
    }));
  }

  static async create({ title, content, folderId, tags = [], userId }) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create the note
      const [result] = await connection.execute(
        'INSERT INTO notes (title, content, folderId, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [title, content, folderId, userId]
      );
      
      const noteId = result.insertId;
      
      // Handle tags
      if (tags && tags.length > 0) {
        await this.updateNoteTags(connection, noteId, tags, userId);
      }
      
      await connection.commit();
      
      // Return the created note with all relations
      const [rows] = await pool.execute(
        `SELECT n.*, f.name as folderName, f.color as folderColor,
         GROUP_CONCAT(t.name) as tags
         FROM notes n
         LEFT JOIN folders f ON n.folderId = f.id
         LEFT JOIN note_tags nt ON n.id = nt.noteId
         LEFT JOIN tags t ON nt.tagId = t.id
         WHERE n.id = ?
         GROUP BY n.id`,
        [noteId]
      );
      
      const note = rows[0];
      return {
        ...note,
        tags: note.tags ? note.tags.split(',') : []
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, { title, content, folderId, tags }) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update the note
      await connection.execute(
        'UPDATE notes SET title = ?, content = ?, folderId = ?, updatedAt = NOW() WHERE id = ?',
        [title, content, folderId, id]
      );
      
      // Handle tags if provided
      if (tags !== undefined) {
        // Get userId for this note
        const [noteRows] = await connection.execute('SELECT userId FROM notes WHERE id = ?', [id]);
        if (noteRows.length > 0) {
          await this.updateNoteTags(connection, id, tags, noteRows[0].userId);
        }
      }
      
      await connection.commit();
      
      // Return updated note with relations
      const [rows] = await pool.execute(
        `SELECT n.*, f.name as folderName, f.color as folderColor,
         GROUP_CONCAT(t.name) as tags
         FROM notes n
         LEFT JOIN folders f ON n.folderId = f.id
         LEFT JOIN note_tags nt ON n.id = nt.noteId
         LEFT JOIN tags t ON nt.tagId = t.id
         WHERE n.id = ?
         GROUP BY n.id`,
        [id]
      );
      
      const note = rows[0];
      return {
        ...note,
        tags: note.tags ? note.tags.split(',') : []
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete note-tag relationships
      await connection.execute('DELETE FROM note_tags WHERE noteId = ?', [id]);
      
      // Delete the note
      await connection.execute('DELETE FROM notes WHERE id = ?', [id]);
      
      await connection.commit();
      return true;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async togglePin(id) {
    await pool.execute(
      'UPDATE notes SET isPinned = NOT isPinned, updatedAt = NOW() WHERE id = ?',
      [id]
    );
    const [rows] = await pool.execute('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0];
  }

  static async toggleArchive(id) {
    await pool.execute(
      'UPDATE notes SET isArchived = NOT isArchived, updatedAt = NOW() WHERE id = ?',
      [id]
    );
    const [rows] = await pool.execute('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateNoteTags(connection, noteId, tags, userId) {
    // Remove existing note-tag relationships
    await connection.execute('DELETE FROM note_tags WHERE noteId = ?', [noteId]);
    
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let [tagRows] = await connection.execute(
          'SELECT id FROM tags WHERE name = ? AND userId = ?',
          [tagName, userId]
        );
        
        let tagId;
        if (tagRows.length === 0) {
          // Create new tag
          const [tagResult] = await connection.execute(
            'INSERT INTO tags (name, userId, createdAt) VALUES (?, ?, NOW())',
            [tagName, userId]
          );
          tagId = tagResult.insertId;
        } else {
          tagId = tagRows[0].id;
        }
        
        // Create note-tag relationship
        await connection.execute(
          'INSERT INTO note_tags (noteId, tagId) VALUES (?, ?)',
          [noteId, tagId]
        );
      }
    }
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT n.*, f.name as folderName, f.color as folderColor,
       GROUP_CONCAT(t.name) as tags
       FROM notes n
       LEFT JOIN folders f ON n.folderId = f.id
       LEFT JOIN note_tags nt ON n.id = nt.noteId
       LEFT JOIN tags t ON nt.tagId = t.id
       WHERE n.id = ?
       GROUP BY n.id`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const note = rows[0];
    return {
      ...note,
      tags: note.tags ? note.tags.split(',') : []
    };
  }
}

module.exports = Note;

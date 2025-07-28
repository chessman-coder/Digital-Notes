const pool = require('../config/db');

class Tag {
  static async findByUser(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM tags WHERE userId = ? ORDER BY name',
      [userId]
    );
    return rows;
  }

  static async create({ name, userId }) {
    // Check if tag already exists for this user
    const [existing] = await pool.execute(
      'SELECT * FROM tags WHERE name = ? AND userId = ?',
      [name, userId]
    );
    
    if (existing.length > 0) {
      return existing[0];
    }

    const [result] = await pool.execute(
      'INSERT INTO tags (name, userId, createdAt) VALUES (?, ?, NOW())',
      [name, userId]
    );
    const [rows] = await pool.execute('SELECT * FROM tags WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete note-tag relationships
      await connection.execute('DELETE FROM note_tags WHERE tagId = ?', [id]);
      
      // Delete the tag
      await connection.execute('DELETE FROM tags WHERE id = ?', [id]);
      
      await connection.commit();
      return true;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM tags WHERE id = ?', [id]);
    return rows[0];
  }

  static async getPopularTags(userId, limit = 10) {
    const [rows] = await pool.execute(
      `SELECT t.*, COUNT(nt.noteId) as usage_count
       FROM tags t
       LEFT JOIN note_tags nt ON t.id = nt.tagId
       WHERE t.userId = ?
       GROUP BY t.id
       ORDER BY usage_count DESC, t.name
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }
}

module.exports = Tag;
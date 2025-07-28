const pool = require('../config/db');

class Folder {
  static async findByUser(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM folders WHERE userId = ? ORDER BY name',
      [userId]
    );
    return rows;
  }

  static async create({ name, color, userId }) {
    const [result] = await pool.execute(
      'INSERT INTO folders (name, color, userId, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [name, color, userId]
    );
    const [rows] = await pool.execute('SELECT * FROM folders WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async update(id, { name, color }) {
    await pool.execute(
      'UPDATE folders SET name = ?, color = ?, updatedAt = NOW() WHERE id = ?',
      [name, color, id]
    );
    const [rows] = await pool.execute('SELECT * FROM folders WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    await pool.execute('DELETE FROM folders WHERE id = ?', [id]);
    return true;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM folders WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = Folder;
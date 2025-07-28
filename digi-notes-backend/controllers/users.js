
const User = require('../models/User');
const { AppError } = require('../utils/error');


exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { username, email, profile_pic } = req.body;
    const fields = [];
    const values = [];
    
    if (username) { fields.push('username = ?'); values.push(username); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (profile_pic) { fields.push('profile_pic = ?'); values.push(profile_pic); }
    
    if (fields.length === 0) {
      return next(new AppError('No fields to update', 400));
    }
    
    values.push(req.user.id);
    await require('../config/db').execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    const updatedUser = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (err) {
    next(err);
  }
};
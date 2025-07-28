const Tag = require('../models/tag');
const { AppError } = require('../utils/error');

exports.getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.findByUser(req.user.id);
    res.status(200).json({
      status: 'success',
      results: tags.length,
      data: { tags }
    });
  } catch (err) {
    next(err);
  }
};

exports.getPopularTags = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const tags = await Tag.getPopularTags(req.user.id, limit);
    res.status(200).json({
      status: 'success',
      results: tags.length,
      data: { tags }
    });
  } catch (err) {
    next(err);
  }
};

exports.getTagById = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }
    
    // Security check: Ensure user owns this tag
    if (tag.userId !== req.user.id) {
      return next(new AppError('You do not have permission to access this tag', 403));
    }
    
    res.status(200).json({
      status: 'success',
      data: { tag }
    });
  } catch (err) {
    next(err);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return next(new AppError('Tag name is required', 400));
    }
    
    const tag = await Tag.create({
      name: name.trim(),
      userId: req.user.id
    });
    
    res.status(201).json({
      status: 'success',
      data: { tag }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }
    
    // Security check: Ensure user owns this tag
    if (tag.userId !== req.user.id) {
      return next(new AppError('You do not have permission to delete this tag', 403));
    }
    
    await Tag.delete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
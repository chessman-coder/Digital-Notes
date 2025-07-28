const Folder = require('../models/folder');
const { AppError } = require('../utils/error');

exports.getAllFolders = async (req, res, next) => {
  try {
    const folders = await Folder.findByUser(req.user.id);
    res.status(200).json({
      status: 'success',
      results: folders.length,
      data: { folders }
    });
  } catch (err) {
    next(err);
  }
};

exports.getFolderById = async (req, res, next) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return next(new AppError('Folder not found', 404));
    }
    
    // Security check: Ensure user owns this folder
    if (folder.userId !== req.user.id) {
      return next(new AppError('You do not have permission to access this folder', 403));
    }
    
    res.status(200).json({
      status: 'success',
      data: { folder }
    });
  } catch (err) {
    next(err);
  }
};

exports.createFolder = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return next(new AppError('Folder name is required', 400));
    }
    
    const folder = await Folder.create({
      name,
      color: color || 'bg-gray-500',
      userId: req.user.id
    });
    
    res.status(201).json({
      status: 'success',
      data: { folder }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateFolder = async (req, res, next) => {
  try {
    // First check if folder exists and user owns it
    const existingFolder = await Folder.findById(req.params.id);
    if (!existingFolder) {
      return next(new AppError('Folder not found', 404));
    }
    
    // Security check: Ensure user owns this folder
    if (existingFolder.userId !== req.user.id) {
      return next(new AppError('You do not have permission to update this folder', 403));
    }
    
    const { name, color } = req.body;
    const folder = await Folder.update(req.params.id, {
      name,
      color
    });
    
    res.status(200).json({
      status: 'success',
      data: { folder }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return next(new AppError('Folder not found', 404));
    }
    
    // Security check: Ensure user owns this folder
    if (folder.userId !== req.user.id) {
      return next(new AppError('You do not have permission to delete this folder', 403));
    }
    
    await Folder.delete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
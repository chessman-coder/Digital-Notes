const Note = require('../models/note');
const { AppError } = require('../utils/error');

exports.getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.findByUser(req.user.id);
    res.status(200).json({
      status: 'success',
      results: notes.length,
      data: { notes }
    });
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return next(new AppError('Note not found', 404));
    }
    
    // Security check: Ensure user owns this note
    if (note.userId !== req.user.id) {
      return next(new AppError('You do not have permission to access this note', 403));
    }
    
    res.status(200).json({
      status: 'success',
      data: { note }
    });
  } catch (err) {
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, folderId, tags } = req.body;
    const note = await Note.create({
      title,
      content,
      folderId,
      tags,
      userId: req.user.id
    });
    res.status(201).json({
      status: 'success',
      data: { note }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    // First check if note exists and user owns it
    const existingNote = await Note.findById(req.params.id);
    if (!existingNote) {
      return next(new AppError('Note not found', 404));
    }
    
    // Security check: Ensure user owns this note
    if (existingNote.userId !== req.user.id) {
      return next(new AppError('You do not have permission to update this note', 403));
    }
    
    const { title, content, folderId, tags } = req.body;
    const note = await Note.update(req.params.id, {
      title,
      content,
      folderId,
      tags
    });
    
    res.status(200).json({
      status: 'success',
      data: { note }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return next(new AppError('Note not found', 404));
    }
    
    // Security check: Ensure user owns this note
    if (note.userId !== req.user.id) {
      return next(new AppError('You do not have permission to delete this note', 403));
    }
    
    await Note.delete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.togglePin = async (req, res, next) => {
  try {
    // First check if note exists and user owns it
    const existingNote = await Note.findById(req.params.id);
    if (!existingNote) {
      return next(new AppError('Note not found', 404));
    }
    
    // Security check: Ensure user owns this note
    if (existingNote.userId !== req.user.id) {
      return next(new AppError('You do not have permission to modify this note', 403));
    }
    
    const note = await Note.togglePin(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { note }
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleArchive = async (req, res, next) => {
  try {
    // First check if note exists and user owns it
    const existingNote = await Note.findById(req.params.id);
    if (!existingNote) {
      return next(new AppError('Note not found', 404));
    }
    
    // Security check: Ensure user owns this note
    if (existingNote.userId !== req.user.id) {
      return next(new AppError('You do not have permission to modify this note', 403));
    }
    
    const note = await Note.toggleArchive(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { note }
    });
  } catch (err) {
    next(err);
  }
};
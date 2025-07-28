const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const noteController = require('../controllers/notes');

router.use(auth);

router.route('/')
  .get(noteController.getAllNotes)
  .post(noteController.createNote);

router.route('/:id')
  .get(noteController.getNoteById)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

router.patch('/:id/pin', noteController.togglePin);
router.patch('/:id/archive', noteController.toggleArchive);

module.exports = router;
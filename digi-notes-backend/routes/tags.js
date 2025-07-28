const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const tagController = require('../controllers/tags');

router.use(auth);

router.route('/')
  .get(tagController.getAllTags)
  .post(tagController.createTag);

router.get('/popular', tagController.getPopularTags);

router.route('/:id')
  .get(tagController.getTagById)
  .delete(tagController.deleteTag);

module.exports = router;
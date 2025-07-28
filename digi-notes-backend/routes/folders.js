const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const folderController = require('../controllers/folders');

router.use(auth);

router.route('/')
  .get(folderController.getAllFolders)
  .post(folderController.createFolder);

router.route('/:id')
  .get(folderController.getFolderById)
  .patch(folderController.updateFolder)
  .delete(folderController.deleteFolder);

module.exports = router;
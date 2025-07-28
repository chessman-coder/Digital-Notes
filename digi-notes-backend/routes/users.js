const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const auth = require('../utils/auth');

router.use(auth);

router.route('/me')
  .get(userController.getMe)
  .patch(userController.updateMe);

module.exports = router;
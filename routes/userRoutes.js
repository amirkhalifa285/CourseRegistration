const express = require('express');
const { getUserDetails, updateUserDetails, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getUserDetails);
router.put('/me', authMiddleware, updateUserDetails);
router.delete('/me', authMiddleware, deleteUser);

module.exports = router;

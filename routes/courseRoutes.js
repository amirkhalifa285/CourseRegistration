const express = require('express');
const {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
} = require('../controllers/courseController');
const { authMiddleware, authorizeFaculty, authorizeStudent } = require('../middlewares/authMiddleware');
const router = express.Router();

// General access to view courses
router.get('/', authMiddleware, getCourses);

// Faculty-only operations
router.post('/', authMiddleware, authorizeFaculty, addCourse);
router.put('/:id', authMiddleware, authorizeFaculty, updateCourse);
router.delete('/:id', authMiddleware, authorizeFaculty, deleteCourse);

// Student-only operations
router.post('/:id/enroll', authMiddleware, authorizeStudent, enrollCourse);
router.delete('/:id/enroll', authMiddleware, authorizeStudent, unenrollCourse);

module.exports = router;

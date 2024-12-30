const express = require('express');
const {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  getStudentCredits,
  getStudentCourses
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
router.get('/credits', authMiddleware, authorizeStudent, getStudentCredits);
router.get('/my-courses', authMiddleware, authorizeStudent, getStudentCourses); 


module.exports = router;

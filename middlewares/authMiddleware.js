const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Attach user data to the request based on role
    if (req.user.role === 'student') {
      req.userData = await Student.findById(req.user.id);
    } else if (req.user.role === 'faculty') {
      req.userData = await Faculty.findById(req.user.id);
    }

    if (!req.userData) {
      return res.status(401).json({ error: 'Invalid user credentials' });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const authorizeFaculty = (req, res, next) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Access restricted to faculty only' });
  }
  next();
};

const authorizeStudent = async (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access restricted to students only' });
  }

  const student = req.userData;
  const { id } = req.params;

  // Ensure the student is enrolled in the course for any operations
  if (!student.registeredCourses.includes(id)) {
    return res.status(403).json({ error: 'You are not authorized for this course' });
  }

  next();
};

module.exports = { authMiddleware, authorizeFaculty, authorizeStudent };

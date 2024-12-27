const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const getUserDetails = async (req, res, next) => {
  try {
    let user;
    if (req.user.role === 'student') {
      user = await Student.findById(req.user.id).populate('registeredCourses');
    } else if (req.user.role === 'faculty') {
      user = await Faculty.findById(req.user.id);
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUserDetails = async (req, res, next) => {
  try {
    const updateFields = req.body;

    let user;
    if (req.user.role === 'student') {
      user = await Student.findByIdAndUpdate(req.user.id, updateFields, { new: true });
    } else if (req.user.role === 'faculty') {
      user = await Faculty.findByIdAndUpdate(req.user.id, updateFields, { new: true });
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      await Student.findByIdAndDelete(req.user.id);
    } else if (req.user.role === 'faculty') {
      await Faculty.findByIdAndDelete(req.user.id);
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserDetails, updateUserDetails, deleteUser };

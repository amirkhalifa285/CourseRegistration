const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const signUp = async (req, res, next) => {
  const { role, name, address, year, studentId, facultyId, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === 'student') {
      user = new Student({ studentId, name, address, year, password: hashedPassword });
    } else if (role === 'faculty') {
      user = new Faculty({ facultyId, name, address, password: hashedPassword });
    } else {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { role, id, password } = req.body;

  try {
    let user;
    if (role === 'student') {
      user = await Student.findOne({ studentId: id });
    } else if (role === 'faculty') {
      user = await Faculty.findOne({ facultyId: id });
    } else {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    res.status(200).json({ accessToken: token });
  } catch (err) {
    next(err);
  }
};

module.exports = { signUp, login };

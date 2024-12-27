const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const signUp = async (req, res, next) => {
  const { role, name, address, year, studentId, facultyId, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === 'student') {
      user = new Student({
        studentId,
        name,
        address,
        year,
        password: hashedPassword, // Save hashed password
      });
    } else if (role === 'faculty') {
      user = new Faculty({
        facultyId,
        name,
        address,
        password: hashedPassword, // Save hashed password
      });
    } else {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during sign-up:', err);
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

    // Debug logs
    console.log('User retrieved:', user);
    console.log('Password provided:', password);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Hashed password in DB:', user.password);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    res.status(200).json({ accessToken: token });
  } catch (err) {
    console.error('Error during login:', err);
    next(err);
  }
};



module.exports = { signUp, login };

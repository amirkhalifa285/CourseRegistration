<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);


const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
=======
require
>>>>>>> 12c69ae24cbbae236bb7fe3bdf387e5cb3b1c367

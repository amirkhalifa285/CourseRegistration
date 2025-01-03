require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const { logger, consoleLogger } = require('./utils/logger');

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

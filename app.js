const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const booksRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('📚 Book Review API running!');
});

module.exports = app;

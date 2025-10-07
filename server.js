const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

app.use('/', authRoutes);
app.use('/books', bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📚 Book review API running on http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: { type: String, unique: true },
  title: String,
  author: String,
  reviews: [{
    username: String,
    review: String
  }]
});

module.exports = mongoose.model('Book', bookSchema);

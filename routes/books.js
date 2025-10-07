const express = require('express');
const fs = require('fs/promises');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

const booksPath = './data/books.json';

// 1. جميع الكتب
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(booksPath, 'utf-8');
    const books = JSON.parse(data);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 2. بحث حسب ISBN
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const data = await fs.readFile(booksPath, 'utf-8');
    const books = JSON.parse(data);
    const book = books.find(b => b.isbn === req.params.isbn);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 3. بحث حسب المؤلف
router.get('/author/:author', async (req, res) => {
  try {
    const data = await fs.readFile(booksPath, 'utf-8');
    const books = JSON.parse(data);
    const matches = books.filter(b => b.author.toLowerCase().includes(req.params.author.toLowerCase()));
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 4. بحث حسب العنوان
router.get('/title/:title', async (req, res) => {
  try {
    const data = await fs.readFile(booksPath, 'utf-8');
    const books = JSON.parse(data);
    const matches = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 5. مراجعات كتاب
router.get('/review/:isbn', async (req, res) => {
  try {
    const data = await fs.readFile(booksPath, 'utf-8');
    const books = JSON.parse(data);
    const book = books.find(b => b.isbn === req.params.isbn);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book.reviews || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 6. إضافة/تعديل مراجعة (مستخدم مسجل)
router.put('/review/:isbn', authenticate, async (req, res) => {
  try {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;

    const data = await fs.readFile(booksPath, 'utf-8');
    const books = JSON.parse(data);
    const book = books.find(b => b.isbn === isbn);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.reviews) book.reviews = {};
    book.reviews[username] = review;

    await fs.writeFile(booksPath, JSON.stringify(books, null, 2));
    res.json({ message: 'Review added/updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 7. حذف مراجعة (مستخدم مسجل)
router.delete('/review/:isbn', authenticate, async (req, res) => {
  try {
    const { isbn } = req.params;
    const username = req.user.username;

    const data = await fs.readFile(booksPath, 'utf-8');
    const books = JSON.parse(data);
    const book = books.find(b => b.isbn === isbn);
    if (!book || !book.reviews || !(username in book.reviews)) {
      return res.status(404).json({ message: 'Review not found' });
    }

    delete book.reviews[username];
    await fs.writeFile(booksPath, JSON.stringify(books, null, 2));
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

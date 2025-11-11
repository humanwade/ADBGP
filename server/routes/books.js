import express from 'express';
import { getConnection } from '../db/oracle.js';

const router = express.Router();

// GET /api/books
router.get('/', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute('SELECT * FROM GP_LMS_BOOKS');
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).send('Failed to fetch books');
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      'SELECT * FROM GP_LMS_BOOKS WHERE BOOK_ID = :id',
      [bookId]
    );
    await conn.close();

    if (result.rows.length === 0) {
      res.status(404).send('Book not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).send('Failed to fetch book');
  }
});

// POST /api/books
router.post('/', async (req, res) => {
  const { TITLE, AUTHOR, PUBLISHER_ID, ISBN, PUB_YEAR } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO GP_LMS_BOOKS (TITLE, AUTHOR, PUBLISHER_ID, ISBN, PUB_YEAR)
       VALUES (:title, :author, :publisher_id, :isbn, :pub_year)`,
      [TITLE, AUTHOR, PUBLISHER_ID, ISBN, PUB_YEAR],
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).send('Book added');
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).send('Failed to add book');
  }
});

// PUT /api/books/:id
router.put('/:id', async (req, res) => {
  const bookId = req.params.id;
  const { TITLE, AUTHOR, PUBLISHER_ID, ISBN, PUB_YEAR } = req.body;
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `UPDATE GP_LMS_BOOKS SET TITLE = :title, AUTHOR = :author,
       PUBLISHER_ID = :publisher_id, ISBN = :isbn, PUB_YEAR = :pub_year
       WHERE BOOK_ID = :id`,
      [TITLE, AUTHOR, PUBLISHER_ID, ISBN, PUB_YEAR, bookId],
      { autoCommit: true }
    );
    await conn.close();

    if (result.rowsAffected === 0) {
      res.status(404).send('Book not found');
    } else {
      res.send('Book updated');
    }
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Failed to update book');
  }
});

// DELETE /api/books/:id
router.delete('/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      'DELETE FROM GP_LMS_BOOKS WHERE BOOK_ID = :id',
      [bookId],
      { autoCommit: true }
    );
    await conn.close();

    if (result.rowsAffected === 0) {
      res.status(404).send('Book not found');
    } else {
      res.send('Book deleted');
    }
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Failed to delete book');
  }
});

//GET /api/books/:bookId/loans
router.get('/:bookId/loans', async (req, res) => {
  const bookId = req.params.bookId;

  try {
    const conn = await getConnection();
    const result = await conn.execute(`
      SELECT L.LOAN_ID, L.COPY_ID, L.MEMBER_ID, L.LOAN_DATE, L.RETURN_DATE
      FROM GP_LMS_LOANS L
      JOIN GP_LMS_BOOK_COPIES C ON L.COPY_ID = C.COPY_ID
      WHERE C.BOOK_ID = :bookId
      ORDER BY L.LOAN_DATE DESC
    `, [bookId]);
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch book loan history:', err);
    res.status(500).send('Error fetching loan history');
  }
});

export default router;
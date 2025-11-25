import express from 'express';
import { getConnection } from '../db/oracle.js';
import oracledb from 'oracledb';

const router = express.Router();

// ==================================================================
// [CRITICAL] 1. Get Available Copies for Dropdown (GET /api/books/available)
// * MUST be placed BEFORE '/:id' route to prevent 'ORA-01722' error
// ==================================================================
router.get('/available', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`
      SELECT C.COPY_ID, B.TITLE, C.COPY_NO
      FROM GP_LMS_BOOK_COPIES C
      JOIN GP_LMS_BOOKS B ON C.BOOK_ID = B.BOOK_ID
      WHERE C.STATUS = 'Available'
      ORDER BY B.TITLE ASC
    `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    await conn.close();

    // Format for frontend dropdown
    const list = result.rows.map(row => ({
      copyId: row.COPY_ID,
      displayTitle: `${row.TITLE} (Copy #${row.COPY_NO})`
    }));

    res.json(list);
  } catch (err) {
    console.error('Error fetching available books:', err);
    res.status(500).send('Failed to fetch available books');
  }
});

// ==================================================================
// 2. Get All Books with Copy Count (GET /api/books)
// ==================================================================
router.get('/', async (req, res) => {
  try {
    const conn = await getConnection();
    
    // Use JOIN & GROUP BY to count actual copies
    const sql = `
      SELECT 
        B.BOOK_ID, B.TITLE, B.AUTHOR, B.PUBLISHER_ID, B.ISBN, B.PUB_YEAR, B.GENRE,
        COUNT(C.COPY_ID) AS TOTAL_COPIES
      FROM GP_LMS_BOOKS B
      LEFT JOIN GP_LMS_BOOK_COPIES C ON B.BOOK_ID = C.BOOK_ID
      GROUP BY B.BOOK_ID, B.TITLE, B.AUTHOR, B.PUBLISHER_ID, B.ISBN, B.PUB_YEAR, B.GENRE
      ORDER BY B.BOOK_ID DESC
    `;

    const result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await conn.close();

    // Map DB uppercase keys to frontend lowercase keys
    const books = result.rows.map(row => ({
      id: row.BOOK_ID,
      title: row.TITLE,
      author: row.AUTHOR,
      isbn: row.ISBN,
      year: row.PUB_YEAR,
      genre: row.GENRE,
      publisher_id: row.PUBLISHER_ID,
      copies: row.TOTAL_COPIES // Actual count from DB
    }));

    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).send('Failed to fetch books');
  }
});

// ==================================================================
// 3. Get Book Details (GET /api/books/:id)
// ==================================================================
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;
  
  // Validation: Check if ID is a number
  if (isNaN(bookId)) {
      return res.status(400).send('Invalid Book ID');
  }

  try {
    const conn = await getConnection();
    // Fetch book info AND total copies count
    const sql = `
      SELECT 
        B.*, 
        (SELECT COUNT(*) FROM GP_LMS_BOOK_COPIES WHERE BOOK_ID = B.BOOK_ID) AS TOTAL_COPIES
      FROM GP_LMS_BOOKS B 
      WHERE B.BOOK_ID = :id
    `;

    const result = await conn.execute(
      sql,
      [bookId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();

    if (result.rows.length === 0) {
      res.status(404).send('Book not found');
    } else {
      const row = result.rows[0];
      const book = {
        id: row.BOOK_ID,
        title: row.TITLE,
        author: row.AUTHOR,
        isbn: row.ISBN,
        year: row.PUB_YEAR,
        genre: row.GENRE,
        publisher_id: row.PUBLISHER_ID,
        copies: row.TOTAL_COPIES 
      };
      res.json(book);
    }
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).send('Failed to fetch book');
  }
});

// ==================================================================
// 4. Add New Book (POST /api/books)
// ==================================================================
router.post('/', async (req, res) => {
  const { title, author, isbn, year, copies, genre, publisher_id } = req.body;

  if (!title || !author || !isbn) {
    return res.status(400).json({ message: 'Title, Author, and ISBN are required.' });
  }

  let conn;
  try {
    conn = await getConnection();

    // 1) Insert Book
    const bookResult = await conn.execute(
      `INSERT INTO GP_LMS_BOOKS (TITLE, AUTHOR, ISBN, PUB_YEAR, PUBLISHER_ID, GENRE)
       VALUES (:title, :author, :isbn, :pub_year, :publisher_id, :genre)
       RETURNING BOOK_ID INTO :id`,
      {
        title: title,
        author: author,
        isbn: isbn,
        pub_year: year,
        publisher_id: publisher_id || 1, 
        genre: genre || null,            
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: false } 
    );

    const newBookId = bookResult.outBinds.id[0];

    // 2) Create Copies
    const numCopies = parseInt(copies) || 1;
    for (let i = 1; i <= numCopies; i++) {
      await conn.execute(
        `INSERT INTO GP_LMS_BOOK_COPIES (BOOK_ID, COPY_NO, STATUS)
         VALUES (:book_id, :copy_no, 'Available')`,
        { book_id: newBookId, copy_no: i },
        { autoCommit: false }
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Book added successfully', bookId: newBookId });

  } catch (err) {
    console.error('Error adding book:', err);
    if (conn) {
      try { await conn.rollback(); } catch (e) { console.error(e); } 
    }
    res.status(500).send('Failed to add book');
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) { console.error(e); }
    }
  }
});

// ==================================================================
// 5. Update Book (PUT /api/books/:id)
// ==================================================================
router.put('/:id', async (req, res) => {
  const bookId = req.params.id;
  const { title, author, publisher_id, isbn, year, genre } = req.body;
  
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `UPDATE GP_LMS_BOOKS 
       SET TITLE = :title, AUTHOR = :author,
           PUBLISHER_ID = :publisher_id, ISBN = :isbn, 
           PUB_YEAR = :pub_year, GENRE = :genre
       WHERE BOOK_ID = :id`,
      {
        title: title,
        author: author,
        publisher_id: publisher_id,
        isbn: isbn,
        pub_year: year,
        genre: genre,
        id: bookId
      },
      { autoCommit: true }
    );
    await conn.close();

    if (result.rowsAffected === 0) {
      res.status(404).send('Book not found');
    } else {
      res.json({ message: 'Book updated successfully' });
    }
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Failed to update book');
  }
});

// ==================================================================
// 6. Delete Book with Cascade (DELETE /api/books/:id)
// ==================================================================
router.delete('/:id', async (req, res) => {
  const bookId = req.params.id;
  let conn;

  try {
    conn = await getConnection();
    
    // 1) Delete Loans related to copies of this book
    await conn.execute(
      `DELETE FROM GP_LMS_LOANS 
       WHERE COPY_ID IN (SELECT COPY_ID FROM GP_LMS_BOOK_COPIES WHERE BOOK_ID = :id)`,
      [bookId],
      { autoCommit: false }
    );

    // 2) Delete Copies
    await conn.execute(
      'DELETE FROM GP_LMS_BOOK_COPIES WHERE BOOK_ID = :id',
      [bookId],
      { autoCommit: false }
    );

    // 3) Delete Book
    const result = await conn.execute(
      'DELETE FROM GP_LMS_BOOKS WHERE BOOK_ID = :id',
      [bookId],
      { autoCommit: false }
    );

    await conn.commit();
    await conn.close();

    if (result.rowsAffected === 0) {
      res.status(404).send('Book not found');
    } else {
      res.json({ message: 'Book and associated records deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting book:', err);
    if (conn) { try { await conn.rollback(); } catch (e) {} }
    res.status(500).send('Failed to delete book');
  }
});

// ==================================================================
// 7. Get Loan History by Book (GET /api/books/:bookId/loans)
// ==================================================================
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
    `, [bookId], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    await conn.close();
    
    const history = result.rows.map(row => ({
        loanId: row.LOAN_ID,
        copyId: row.COPY_ID,
        memberId: row.MEMBER_ID,
        loanDate: row.LOAN_DATE,
        returnDate: row.RETURN_DATE
    }));

    res.json(history);
  } catch (err) {
    console.error('Failed to fetch book loan history:', err);
    res.status(500).send('Error fetching loan history');
  }
});

export default router;
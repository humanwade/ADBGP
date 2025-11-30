import express from 'express';
import { getConnection } from '../db/oracle.js';
import oracledb from 'oracledb';

const router = express.Router();

// ==================================================================
// [CRITICAL] 1. Get Available Copies for Dropdown
// ==================================================================
router.get('/available', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    // 1. Call Procedure
    const result = await conn.execute(
      `BEGIN 
        get_available_books(:cursor); 
      END;`,
      {
        // 2. Binding CURSOR
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    // 3. Get resxult
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows(); 
    await resultSet.close();

    // 4. Data Formatting - the result set is array
    const list = rows.map(row => ({
      copyId: row[0],       // C.COPY_ID
      displayTitle: `${row[1]} (Copy #${row[2]})` // B.TITLE, C.COPY_NO
    }));

    res.json(list);

  } catch (err) {
    console.error('Error fetching available books:', err);
    res.status(500).send('Failed to fetch available books');
  } finally {
    // end connection
    if (conn) {
      try { await conn.close(); } catch (e) { console.error(e); }
    }
  }
});

// ==================================================================
// 2. Get All Books with Copy Count 
// ==================================================================
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    
    // 1. run procedure
    const result = await conn.execute(
      `BEGIN 
        get_all_books(:cursor); 
      END;`,
      {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    // 2. execute date from cursor
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows(); 
    await resultSet.close(); 

    // 3. Chage array date to Front-end object
    // SQL Order: 0:BOOK_ID, 1:TITLE, 2:AUTHOR, 3:PUBLISHER_ID, 
    //          4:ISBN, 5:PUB_YEAR, 6:GENRE, 7:TOTAL_COPIES
    const books = rows.map(row => ({
      id: row[0],
      title: row[1],
      author: row[2],
      publisher_id: row[3],
      isbn: row[4],
      year: row[5],
      genre: row[6],
      copies: row[7] 
    }));

    res.json(books);

  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).send('Failed to fetch books');
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) { console.error(e); }
    }
  }
});

// ==================================================================
// 3. Get Book Details 
// ==================================================================
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;
  
  if (isNaN(bookId)) {
      return res.status(400).send('Invalid Book ID');
  }

  let conn;
  try {
    conn = await getConnection();

    // 1. call procedure
    const result = await conn.execute(
      `BEGIN 
        get_book_details(:id, :cursor); 
      END;`,
      {
        id: bookId, // Parameter (IN)
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } // parameter (OUT)
      }
    );

    // 2. get data
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    // 3. data handling
    if (rows.length === 0) {
      res.status(404).send('Book not found');
    } else {
      const row = rows[0]; 
      
      // SQL SELECT order
      // 0:ID, 1:TITLE, 2:AUTHOR, 3:ISBN, 4:YEAR, 5:GENRE, 6:PUB_ID, 7:COPIES
      const book = {
        id: row[0],
        title: row[1],
        author: row[2],
        isbn: row[3],
        year: row[4],
        genre: row[5],
        publisher_id: row[6],
        copies: row[7] 
      };
      res.json(book);
    }
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).send('Failed to fetch book');
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) { console.error(e); }
    }
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

    const numCopies = parseInt(copies) || 1;
    const pubId = publisher_id || 1; 
    const bookGenre = genre || null;

    // 1. Call procedure
    const result = await conn.execute(
      `BEGIN 
         add_new_book(:title, :author, :isbn, :year, :pub_id, :genre, :copies, :new_id);
       END;`,
      {
        title: title,
        author: author,
        isbn: isbn,
        year: year,
        pub_id: pubId,
        genre: bookGenre,
        copies: numCopies,
        new_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true } 
    );

    // 2. return result
    const newBookId = result.outBinds.new_id[0];
    res.status(201).json({ message: 'Book added successfully', bookId: newBookId });

  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).send('Failed to add book');
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) { console.error(e); }
    }
  }
});

// ==================================================================
// 5. Update Book 
// ==================================================================
router.put('/:id', async (req, res) => {
  const bookId = req.params.id;
  const { title, author, publisher_id, isbn, year, genre, copies } = req.body;
  
  let conn;
  try {
    conn = await getConnection();

    const numCopies = parseInt(copies) || 0;
    const result = await conn.execute(
      `BEGIN 
         update_book(:id, :title, :author, :pub_id, :isbn, :year, :genre, :copies, :count);
       END;`,
      {
        id: bookId,
        title: title,
        author: author,
        pub_id: publisher_id,
        isbn: isbn,
        year: year,
        genre: genre,
        copies: numCopies, 
        count: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );

    const rowsAffected = result.outBinds.count[0];

    if (rowsAffected === 0) {
      res.status(404).send('Book not found');
    } else {
      res.json({ message: 'Book updated successfully' });
    }

  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Failed to update book');
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

// ==================================================================
// 6. Delete Book with Cascade 
// ==================================================================
router.delete('/:id', async (req, res) => {
  const bookId = req.params.id;
  
  let conn;
  try {
    conn = await getConnection();
    
    const result = await conn.execute(
      `BEGIN 
        delete_book(:id, :count); 
      END;`,
      {
        id: bookId,
        count: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true } 
    );

    const rowsAffected = result.outBinds.count[0];

    if (rowsAffected === 0) {
      res.status(404).send('Book not found');
    } else {
      res.json({ message: 'Book and associated records deleted successfully' });
    }

  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Failed to delete book');
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

// ==================================================================
// 7. Get Loan History by Book (GET /api/books/:bookId/loans)
// ==================================================================
router.get('/:bookId/loans', async (req, res) => {
  const bookId = req.params.bookId;
  
  let conn;
  try {
    conn = await getConnection();
    
    // 1. Call procedure
    const result = await conn.execute(
      `BEGIN get_book_loan_history(:id, :cursor); END;`,
      {
        id: bookId,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );
    
    // 2. get Data
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();
    
    // 3. Array to Object (order: 0:LOAN_ID, 1:COPY_ID, 2:MEMBER_ID, 3:LOAN, 4:RETURN)
    const history = rows.map(row => ({
        loanId: row[0],
        copyId: row[1],
        memberId: row[2],
        loanDate: row[3],
        returnDate: row[4]
    }));

    res.json(history);

  } catch (err) {
    console.error('Failed to fetch book loan history:', err);
    res.status(500).send('Error fetching loan history');
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

export default router;
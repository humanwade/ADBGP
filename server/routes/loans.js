import express from 'express';
import oracledb from 'oracledb';
import { getConnection } from '../db/oracle.js';

const router = express.Router();

// ==========================================
// 1. Get Loans (GET /api/loans)
// ==========================================
router.get('/', async (req, res) => {
  const { memberId } = req.query;

  try {
    const conn = await getConnection();

    let query = `
      SELECT 
        L.LOAN_ID,
        B.TITLE AS BOOK_TITLE,
        C.COPY_NO,
        M.FIRST_NAME || ' ' || M.LAST_NAME AS MEMBER_NAME,
        TO_CHAR(L.LOAN_DATE, 'YYYY-MM-DD') AS LOAN_DATE,
        TO_CHAR(L.DUE_DATE, 'YYYY-MM-DD') AS DUE_DATE,
        TO_CHAR(L.RETURN_DATE, 'YYYY-MM-DD') AS RETURN_DATE
      FROM GP_LMS_LOANS L
      JOIN GP_LMS_BOOK_COPIES C ON L.COPY_ID = C.COPY_ID
      JOIN GP_LMS_BOOKS B ON C.BOOK_ID = B.BOOK_ID
      JOIN GP_LMS_MEMBERS M ON L.MEMBER_ID = M.MEMBER_ID
    `;

    const binds = {};

    if (memberId) {
      query += ` WHERE L.MEMBER_ID = :mid`;
      binds.mid = memberId;
    }

    query += ` ORDER BY L.LOAN_DATE DESC`;

    const result = await conn.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await conn.close();

    const loans = result.rows.map(row => ({
      id: row.LOAN_ID,
      bookTitle: `${row.BOOK_TITLE} (Copy #${row.COPY_NO})`,
      patronName: row.MEMBER_NAME,
      loanDate: row.LOAN_DATE,
      dueDate: row.DUE_DATE,
      returnDate: row.RETURN_DATE
    }));

    res.json(loans);
  } catch (err) {
    console.error('Error fetching loans:', err);
    res.status(500).send('Failed to fetch loans');
  }
});

// ==========================================
// 2. Create Loan (POST /api/loans)
// ==========================================
router.post('/', async (req, res) => {
  const { copyId, memberId } = req.body;

  if (!copyId || !memberId) {
    return res.status(400).json({ message: 'Copy ID and Member ID are required' });
  }

  let conn;
  try {
    conn = await getConnection();

    // 1. Check if the book copy is actually 'Available'
    const checkStatus = await conn.execute(
      `SELECT STATUS FROM GP_LMS_BOOK_COPIES WHERE COPY_ID = :id`,
      [copyId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkStatus.rows.length === 0) {
      throw new Error('Copy ID not found');
    }
    if (checkStatus.rows[0].STATUS !== 'Available') {
      throw new Error('This book copy is already on loan.');
    }

    // 2. Insert into LOANS table
    await conn.execute(
      `INSERT INTO GP_LMS_LOANS (COPY_ID, MEMBER_ID, LOAN_DATE, DUE_DATE, RETURN_DATE)
       VALUES (:copyId, :memberId, SYSDATE, SYSDATE + 14, NULL)`, // Default 14 days loan
      { copyId, memberId },
      { autoCommit: false } // Start transaction
    );

    // 3. Update BOOK_COPIES status to 'On Loan'
    await conn.execute(
      `UPDATE GP_LMS_BOOK_COPIES SET STATUS = 'On Loan' WHERE COPY_ID = :copyId`,
      { copyId },
      { autoCommit: false }
    );

    await conn.commit(); // Commit both changes
    res.status(201).json({ message: 'Loan created successfully' });

  } catch (err) {
    console.error('Error creating loan:', err);
    if (conn) {
      try { await conn.rollback(); } catch (e) { console.error(e); }
    }
    res.status(500).json({ message: err.message || 'Failed to create loan' });
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) { console.error(e); }
    }
  }
});

// ==========================================
// 3. Return Book (PUT /api/loans/:id/return)
// ==========================================
router.put('/:id/return', async (req, res) => {
  const loanId = req.params.id;
  let conn;

  try {
    conn = await getConnection();

    // 1. Update LOANS table (Set Return Date)
    await conn.execute(
      `UPDATE GP_LMS_LOANS
       SET RETURN_DATE = SYSDATE
       WHERE LOAN_ID = :loanId`,
      { loanId },
      { autoCommit: false }
    );

    // 2. Update BOOK_COPIES status back to 'Available'
    // (Find Copy ID using Loan ID)
    await conn.execute(
      `UPDATE GP_LMS_BOOK_COPIES
       SET STATUS = 'Available'
       WHERE COPY_ID = (SELECT COPY_ID FROM GP_LMS_LOANS WHERE LOAN_ID = :loanId)`,
      { loanId },
      { autoCommit: false }
    );

    await conn.commit();
    res.json({ message: 'Book returned successfully' });

  } catch (err) {
    console.error('Error returning book:', err);
    if (conn) {
      try { await conn.rollback(); } catch (e) { console.error(e); }
    }
    res.status(500).send('Failed to return book');
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) { console.error(e); }
    }
  }
});

export default router;
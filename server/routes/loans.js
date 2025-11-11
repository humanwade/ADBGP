import express from 'express';
import { getConnection } from '../db/oracle.js';

const router = express.Router();

// GET /api/loans - All loan list
router.get('/', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`
      SELECT
        L.LOAN_ID,
        B.TITLE AS BOOK_TITLE,
        M.FULL_NAME AS MEMBER_NAME,
        TO_CHAR(L.LOAN_DATE, 'YYYY-MM-DD') AS LOAN_DATE,
        TO_CHAR(L.DUE_DATE, 'YYYY-MM-DD') AS DUE_DATE,
        TO_CHAR(L.RETURN_DATE, 'YYYY-MM-DD') AS RETURN_DATE
      FROM GP_LMS_LOANS L
      JOIN GP_LMS_BOOK_COPIES C ON L.COPY_ID = C.COPY_ID
      JOIN GP_LMS_BOOKS B ON C.BOOK_ID = B.BOOK_ID
      JOIN GP_LMS_MEMBERS M ON L.MEMBER_ID = M.MEMBER_ID
      ORDER BY L.LOAN_DATE DESC
    `);
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching loans:', err);
    res.status(500).send('Failed to fetch loans');
  }
});

// POST /api/loans
router.post('/', async (req, res) => {
  const { copyId, memberId } = req.body;

  if (!copyId || !memberId) {
    return res.status(400).json({ message: 'copyId and memberId are required' });
  }

  try {
    const conn = await getConnection();

    // INSERT INTO LOANS
    const insertResult = await conn.execute(
      `INSERT INTO GP_LMS_LOANS (COPY_ID, MEMBER_ID, LOAN_DATE, DUE_DATE, RETURN_DATE)
       VALUES (:copyId, :memberId, SYSDATE, SYSDATE + 7, NULL)`,
      { copyId, memberId },
      { autoCommit: true }
    );

    // Change book status after loan
    await conn.execute(
      `UPDATE GP_LMS_BOOK_COPIES SET STATUS = 'On Loan' WHERE COPY_ID = :copyId`,
      { copyId },
      { autoCommit: true }
    );

    await conn.close();
    res.status(201).json({ message: 'Loan created successfully' });

  } catch (err) {
    console.error('Error creating loan:', err);
    res.status(500).send('Failed to create loan');
  }
});

// GET /api/loans/member/:id
router.get('/member/:id', async (req, res) => {
  const memberId = req.params.id;

  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT 
         L.LOAN_ID,
         B.TITLE,
         C.COPY_NO,
         L.LOAN_DATE,
         L.DUE_DATE,
         L.RETURN_DATE
       FROM 
         GP_LMS_LOANS L
       JOIN 
         GP_LMS_BOOK_COPIES C ON L.COPY_ID = C.COPY_ID
       JOIN 
         GP_LMS_BOOKS B ON C.BOOK_ID = B.BOOK_ID
       WHERE 
         L.MEMBER_ID = :memberId
       ORDER BY L.LOAN_DATE DESC`,
      { memberId }
    );

    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching member loans:', err);
    res.status(500).send('Failed to fetch member loans');
  }
});

// GET /api/loans/status
router.get('/status', async (req, res) => {
  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT 
         B.TITLE,
         C.COPY_NO,
         C.STATUS,
         M.FULL_NAME AS MEMBER_NAME,
         L.LOAN_DATE
       FROM 
         GP_LMS_BOOK_COPIES C
       JOIN 
         GP_LMS_BOOKS B ON C.BOOK_ID = B.BOOK_ID
       LEFT JOIN 
         GP_LMS_LOANS L ON C.COPY_ID = L.COPY_ID AND L.RETURN_DATE IS NULL
       LEFT JOIN 
         GP_LMS_MEMBERS M ON L.MEMBER_ID = M.MEMBER_ID
       ORDER BY B.TITLE, C.COPY_NO`
    );

    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching overall loan status:', err);
    res.status(500).send('Failed to fetch overall loan status');
  }
});

// GET /api/loans/availability
router.get('/availability', async (req, res) => {
  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT 
         B.BOOK_ID,
         B.TITLE,
         COUNT(C.COPY_ID) AS TOTAL_COPIES,
         SUM(CASE WHEN C.STATUS = 'Available' THEN 1 ELSE 0 END) AS AVAILABLE_COPIES,
         CASE 
           WHEN SUM(CASE WHEN C.STATUS = 'Available' THEN 1 ELSE 0 END) = 0 THEN 'Fully Loaned Out'
           WHEN COUNT(C.COPY_ID) = SUM(CASE WHEN C.STATUS = 'Available' THEN 1 ELSE 0 END) THEN 'Available'
           ELSE 'Partially Available'
         END AS STATUS
       FROM 
         GP_LMS_BOOKS B
       JOIN 
         GP_LMS_BOOK_COPIES C ON B.BOOK_ID = C.BOOK_ID
       GROUP BY 
         B.BOOK_ID, B.TITLE
       ORDER BY 
         B.TITLE`
    );

    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching book availability:', err);
    res.status(500).send('Failed to fetch book availability');
  }
});


// GET /api/loans/book/:id
router.get('/book/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT 
         C.COPY_NO,
         C.STATUS,
         L.LOAN_DATE,
         L.DUE_DATE,
         L.RETURN_DATE,
         M.FULL_NAME AS MEMBER_NAME
       FROM 
         GP_LMS_BOOK_COPIES C
       LEFT JOIN 
         GP_LMS_LOANS L ON C.COPY_ID = L.COPY_ID AND L.RETURN_DATE IS NULL
       LEFT JOIN 
         GP_LMS_MEMBERS M ON L.MEMBER_ID = M.MEMBER_ID
       WHERE 
         C.BOOK_ID = :bookId
       ORDER BY 
         C.COPY_NO`,
      { bookId }
    );

    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching book loan status:', err);
    res.status(500).send('Failed to fetch book loan status');
  }
});

// PUT /api/loans/:id/return
router.put('/:id/return', async (req, res) => {
  const loanId = req.params.id;

  try {
    const conn = await getConnection();

    // Return process
    await conn.execute(
      `UPDATE GP_LMS_LOANS
       SET RETURN_DATE = SYSDATE
       WHERE LOAN_ID = :loanId`,
      { loanId }
    );

    // Change book status to Available
    await conn.execute(
      `UPDATE GP_LMS_BOOK_COPIES
       SET STATUS = 'Available'
       WHERE COPY_ID = (
         SELECT COPY_ID FROM GP_LMS_LOANS WHERE LOAN_ID = :loanId
       )`,
      { loanId }
    );

    await conn.commit();
    await conn.close();

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).send('Failed to return book');
  }
});

//GET /api/loans/overdue
router.get('/overdue', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`
      SELECT LOAN_ID, COPY_ID, MEMBER_ID, LOAN_DATE, DUE_DATE
      FROM GP_LMS_LOANS
      WHERE RETURN_DATE IS NULL AND DUE_DATE < SYSDATE
    `);
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch overdue loans:', err);
    res.status(500).send('Error fetching overdue loans');
  }
});



export default router;
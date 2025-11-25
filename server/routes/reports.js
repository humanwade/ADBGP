import express from 'express';
import { getConnection } from '../db/oracle.js';

const router = express.Router();

// GET /api/reports/stats
router.get('/stats', async (req, res) => {
  try {
    const conn = await getConnection();
    
    const [bookRes, memberRes, loanRes, overdueRes] = await Promise.all([
      conn.execute('SELECT COUNT(*) AS CNT FROM GP_LMS_BOOKS'),
      conn.execute('SELECT COUNT(*) AS CNT FROM GP_LMS_MEMBERS'),
      conn.execute("SELECT COUNT(*) AS CNT FROM GP_LMS_LOANS WHERE RETURN_DATE IS NULL"),
      conn.execute("SELECT COUNT(*) AS CNT FROM GP_LMS_LOANS WHERE RETURN_DATE IS NULL AND DUE_DATE < SYSDATE")
    ]);

    await conn.close();

    res.json({
      books: bookRes.rows[0][0],   
      patrons: memberRes.rows[0][0],
      loans: loanRes.rows[0][0],
      overdue: overdueRes.rows[0][0]
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).send('Failed to fetch stats');
  }
});

// GET /api/reports/popular
router.get('/popular', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`
      SELECT B.BOOK_ID, B.TITLE, COUNT(L.LOAN_ID) AS LOAN_COUNT
      FROM GP_LMS_BOOKS B
      JOIN GP_LMS_BOOK_COPIES C ON B.BOOK_ID = C.BOOK_ID
      JOIN GP_LMS_LOANS L ON C.COPY_ID = L.COPY_ID
      GROUP BY B.BOOK_ID, B.TITLE
      ORDER BY LOAN_COUNT DESC
      FETCH FIRST 5 ROWS ONLY
    `);
    
    await conn.close();
    
    const popularBooks = result.rows.map(row => ({
      bookId: row[0],
      title: row[1],
      count: row[2]
    }));

    res.json(popularBooks);
  } catch (err) {
    console.error('Error fetching popular books:', err);
    res.status(500).send('Failed to fetch popular books');
  }
});

// GET /api/reports/overdue
router.get('/overdue', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`
      SELECT 
        L.LOAN_ID, 
        B.TITLE, 
        M.FIRST_NAME || ' ' || M.LAST_NAME AS PATRON_NAME,
        TO_CHAR(L.DUE_DATE, 'YYYY-MM-DD') AS DUE_DATE,
        TRUNC(SYSDATE - L.DUE_DATE) * 0.5 AS EST_FINE -- 예: 하루당 $0.5 연체료 계산
      FROM GP_LMS_LOANS L
      JOIN GP_LMS_BOOK_COPIES C ON L.COPY_ID = C.COPY_ID
      JOIN GP_LMS_BOOKS B ON C.BOOK_ID = B.BOOK_ID
      JOIN GP_LMS_MEMBERS M ON L.MEMBER_ID = M.MEMBER_ID
      WHERE L.RETURN_DATE IS NULL AND L.DUE_DATE < SYSDATE
    `);

    await conn.close();

    const overdueList = result.rows.map(row => ({
      id: row[0],
      bookTitle: row[1],
      patronName: row[2],
      dueDate: row[3],
      fine: row[4]
    }));

    res.json(overdueList);
  } catch (err) {
    console.error('Error fetching overdue report:', err);
    res.status(500).send('Failed to fetch overdue report');
  }
});

export default router;
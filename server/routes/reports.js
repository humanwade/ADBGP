import express from 'express';
import { getConnection } from '../db/oracle.js';
import oracledb from 'oracledb';

const router = express.Router();

// 1. GET /api/reports/stats (Dashboard Widgets)
router.get('/stats', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    
    const result = await conn.execute(
      `BEGIN 
         get_dashboard_stats(:books, :patrons, :loans, :overdue); 
       END;`,
      {
        books:   { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        patrons: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        loans:   { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        overdue: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    res.json({
      books: result.outBinds.books,
      patrons: result.outBinds.patrons,
      loans: result.outBinds.loans,
      overdue: result.outBinds.overdue
    });

  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).send('Failed to fetch stats');
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

// 2. GET /api/reports/popular (Top 5 Books)
router.get('/popular', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `BEGIN get_popular_books(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    const popularBooks = rows.map(row => ({
      bookId: row[0],
      title: row[1],
      count: row[2]
    }));

    res.json(popularBooks);
  } catch (err) {
    console.error('Error fetching popular books:', err);
    res.status(500).send('Failed to fetch popular books');
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

// 3. GET /api/reports/overdue (Overdue List + Fine)
router.get('/overdue', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `BEGIN get_overdue_report(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    const overdueList = rows.map(row => ({
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
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

export default router;
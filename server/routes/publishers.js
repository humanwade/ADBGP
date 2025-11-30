import express from 'express';
import { getConnection } from '../db/oracle.js';
import oracledb from 'oracledb';

const router = express.Router();

router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT PUBLISHER_ID, NAME FROM GP_LMS_PUBLISHERS ORDER BY NAME ASC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const list = result.rows.map(row => ({
      id: row.PUBLISHER_ID,
      name: row.NAME
    }));

    res.json(list);
  } catch (err) {
    console.error('Error fetching publishers:', err);
    res.status(500).send('Failed to fetch publishers');
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) { console.error(e); }
    }
  }
});

export default router;
import express from 'express';
import { getConnection } from '../db/oracle.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute('SELECT KEY_NAME, VALUE FROM GP_LMS_SETTINGS');
    await conn.close();

    const settings = {};
    result.rows.forEach(row => {
      settings[row[0]] = row[1]; // row[0]: KEY, row[1]: VALUE
    });

    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).send('Failed settings');
  }
});

// POST /api/settings
router.post('/', async (req, res) => {
  const settings = req.body; // { hours: '...', fineRate: 0.5 }
  
  try {
    const conn = await getConnection();

    for (const [key, value] of Object.entries(settings)) {
        await conn.execute(`
            MERGE INTO GP_LMS_SETTINGS dest
            USING (SELECT :key_name AS k, :val AS v FROM dual) src
            ON (dest.KEY_NAME = src.k)
            WHEN MATCHED THEN UPDATE SET dest.VALUE = src.v
            WHEN NOT MATCHED THEN INSERT (KEY_NAME, VALUE) VALUES (src.k, src.v)
        `, { key_name: key, val: String(value) }, { autoCommit: false });
    }

    await conn.commit();
    await conn.close();
    res.json({ message: 'Settings saved' });
  } catch (err) {
    console.error('Error saving settings:', err);
    res.status(500).send('Failed save settings');
  }
});

export default router;
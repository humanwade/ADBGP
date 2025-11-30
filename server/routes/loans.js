import express from 'express';
import oracledb from 'oracledb';
import { getConnection } from '../db/oracle.js';

const router = express.Router();

// ==========================================
// 1. Get Loans (PL/SQL)
// ==========================================
router.get('/', async (req, res) => {
  const { memberId } = req.query;

  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `BEGIN get_all_loans(:mid, :cursor); END;`,
      {
        mid: memberId || null, 
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    // SQL order: 
    // 0:LOAN_ID, 1:TITLE, 2:COPY_NO, 3:MEMBER_NAME, 
    // 4:LOAN_DATE, 5:DUE_DATE, 6:RETURN_DATE
    const loans = rows.map(row => ({
      id: row[0],
      bookTitle: `${row[1]} (Copy #${row[2]})`,
      patronName: row[3],
      loanDate: row[4],
      dueDate: row[5],
      returnDate: row[6]
    }));

    res.json(loans);
  } catch (err) {
    console.error('Error fetching loans:', err);
    res.status(500).send('Failed to fetch loans');
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

// ==========================================
// 2. Create Loan 
// ==========================================
router.post('/', async (req, res) => {
  const { copyId, memberId, dueDate } = req.body;

  if (!copyId || !memberId) {
    return res.status(400).json({ message: 'Copy ID and Member ID are required' });
  }

  let conn;
  try {
    conn = await getConnection();

    const finalDueDate = dueDate ? new Date(dueDate) : null;

    await conn.execute(
      `BEGIN create_loan(:copyId, :memberId, :dueDate); END;`,
      {
        copyId: copyId,
        memberId: memberId,
        dueDate: { type: oracledb.DATE, val: finalDueDate } 
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Loan created successfully' });

  } catch (err) {
    console.error('Error creating loan:', err);

    if (err.message.includes('already on loan') || err.message.includes('Copy ID not found')) {
        return res.status(400).json({ message: 'Book is already on loan or not found.' });
    }

    res.status(500).json({ message: 'Failed to create loan' });
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

// ==========================================
// 3. Return Book (PL/SQL)
// ==========================================
router.put('/:id/return', async (req, res) => {
  const loanId = req.params.id;
  
  let conn;
  try {
    conn = await getConnection();

    await conn.execute(
      `BEGIN return_book(:loanId); END;`,
      { loanId: loanId },
      { autoCommit: true }
    );

    res.json({ message: 'Book returned successfully' });

  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).send('Failed to return book');
  } finally {
    if (conn) { try { await conn.close(); } catch (e) {} }
  }
});

export default router;
import express from 'express';
import oracledb from 'oracledb';
import { getConnection } from '../db/oracle.js';
// import { verifyToken } from '../middlewares/authMiddleware.js'; // Auth disabled for testing

const router = express.Router();

// Helper function for type binding
const createMemberIdBind = (memberIdValue) => ({
    memberId: { val: Number(memberIdValue), dir: oracledb.BIND_IN, type: oracledb.DB_TYPE_NUMBER }
});

// ==========================================
// 1. Search Members (GET /api/members/search)
// ==========================================
router.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json([]);

    try {
        const conn = await getConnection();
        // [UPDATE] Added PHONE and ADDRESS to search results
        const result = await conn.execute(`
      SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, ADDRESS
      FROM GP_LMS_MEMBERS
      WHERE LOWER(FIRST_NAME) LIKE LOWER(:q) 
         OR LOWER(LAST_NAME) LIKE LOWER(:q)
    `, { q: `%${query}%` }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        await conn.close();
        res.json(result.rows);
    } catch (err) {
        console.error('Search failed:', err);
        res.status(500).send('Search failed');
    }
});

// ==========================================
// 2. Create Member (POST /api/members)
// ==========================================
router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone, address } = req.body;

    if (!firstName || !email) {
        return res.status(400).json({ message: 'Name and Email are required.' });
    }

    try {
        const conn = await getConnection();

        const result = await conn.execute(
            `INSERT INTO GP_LMS_MEMBERS (FIRST_NAME, LAST_NAME, EMAIL, PHONE, ADDRESS, PASSWORD_HASH, ROLE)
             VALUES (:fn, :ln, :em, :ph, :addr, 'temp_1234', 'PATRON')
             RETURNING MEMBER_ID INTO :id`,
            {
                fn: firstName,
                ln: lastName || '',
                em: email,
                ph: phone || null,
                addr: address || null,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );

        await conn.close();
        const newId = result.outBinds.id[0];
        res.status(201).json({ message: 'Member created', id: newId });

    } catch (err) {
        console.error('Create failed:', err);
        res.status(500).send('Create failed');
    }
});

// ==========================================
// 3. Get All Members (GET /api/members)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const conn = await getConnection();
        // [UPDATE] Added ADDRESS to select query
        const result = await conn.execute(`
            SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, ADDRESS
            FROM GP_LMS_MEMBERS
            ORDER BY MEMBER_ID DESC
        `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        await conn.close();

        const members = result.rows.map(row => ({
            id: row.MEMBER_ID,
            firstName: row.FIRST_NAME,
            lastName: row.LAST_NAME,
            email: row.EMAIL,
            phone: row.PHONE,
            address: row.ADDRESS // Include address in response
        }));

        res.json(members);
    } catch (err) {
        console.error('Error fetching members:', err);
        res.status(500).send('Failed to fetch members');
    }
});

// ==========================================
// 4. Get Logged-in Member Info (GET /api/members/me)
// ==========================================
router.get('/me', async (req, res) => {
    const memberIdValue = (req.user && req.user.id) ? String(req.user.id) : '1';
    const binds = createMemberIdBind(memberIdValue);

    try {
        const conn = await getConnection();
        // [UPDATE] Added ADDRESS to select query
        const result = await conn.execute(`
            SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, ADDRESS
            FROM GP_LMS_MEMBERS
            WHERE MEMBER_ID = :memberId
        `, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        await conn.close();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const member = result.rows[0];
        res.json({
            id: member.MEMBER_ID,
            firstName: member.FIRST_NAME,
            lastName: member.LAST_NAME,
            email: member.EMAIL,
            phone: member.PHONE,
            address: member.ADDRESS // Return address
        });
    } catch (err) {
        console.error('Error fetching member info (me):', err);
        res.status(500).send('Error fetching member info');
    }
});

// ==========================================
// 5. Get Member by ID (GET /api/members/:id)
// ==========================================
router.get('/:id', async (req, res) => {
    const memberIdValue = req.params.id;
    if (isNaN(memberIdValue)) return res.status(400).json({ message: 'Invalid ID' });

    const binds = createMemberIdBind(memberIdValue);

    try {
        const conn = await getConnection();
        // [UPDATE] Added ADDRESS to select query
        const result = await conn.execute(`
            SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, ADDRESS
            FROM GP_LMS_MEMBERS
            WHERE MEMBER_ID = :memberId
        `, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        await conn.close();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const member = result.rows[0];
        res.json({
            id: member.MEMBER_ID,
            firstName: member.FIRST_NAME,
            lastName: member.LAST_NAME,
            email: member.EMAIL,
            phone: member.PHONE,
            address: member.ADDRESS // Return address
        });
    } catch (err) {
        console.error('Error fetching member:', err);
        res.status(500).send('Failed to fetch member');
    }
});

// ==========================================
// 6. Update Member (PUT /api/members/:id)
// ==========================================
router.put('/:id', async (req, res) => {
    const memberIdValue = req.params.id;
    const { firstName, lastName, email, phone, address } = req.body;

    const idBinds = createMemberIdBind(memberIdValue);
    const updateBinds = {
        ...idBinds,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone || null,
        address: address || null // Bind address
    };

    try {
        const conn = await getConnection();

        // [UPDATE] Added ADDRESS to UPDATE query
        const result = await conn.execute(`
            UPDATE GP_LMS_MEMBERS
            SET FIRST_NAME = :firstName, LAST_NAME = :lastName, EMAIL = :email,
                PHONE = :phone, ADDRESS = :address
            WHERE MEMBER_ID = :memberId
        `, updateBinds, { autoCommit: true });

        await conn.close();

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ message: 'Member updated successfully', id: memberIdValue });
    } catch (err) {
        console.error('Error updating member:', err);
        res.status(500).send('Failed to update member');
    }
});

// ==========================================
// 7. Delete Member (DELETE /api/members/:id)
// ==========================================
router.delete('/:id', async (req, res) => {
    const memberIdValue = req.params.id;
    const binds = createMemberIdBind(memberIdValue);

    try {
        const conn = await getConnection();

        // Check for active loans before deleting
        const loanCheck = await conn.execute(
            `SELECT COUNT(*) as CNT FROM GP_LMS_LOANS WHERE MEMBER_ID = :memberId`,
            binds, { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (loanCheck.rows[0].CNT > 0) {
            await conn.close();
            return res.status(400).json({ message: 'Cannot delete member with active loans history.' });
        }

        const result = await conn.execute(`
            DELETE FROM GP_LMS_MEMBERS
            WHERE MEMBER_ID = :memberId
        `, binds, { autoCommit: true });

        await conn.close();

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ message: 'Member deleted successfully', id: memberIdValue });
    } catch (err) {
        console.error('Error deleting member:', err);
        res.status(500).send('Failed to delete member');
    }
});

export default router;
import express from 'express';
import oracledb from 'oracledb';
import { getConnection } from '../db/oracle.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Helper function for type binding (to avoid NJS-011 error by converting value to Number)
const createMemberIdBind = (memberIdValue) => ({
    memberId: {
        // Convert the value to a JavaScript Number type to satisfy DB_TYPE_NUMBER
        val: Number(memberIdValue), 
        dir: oracledb.BIND_IN,
        type: oracledb.DB_TYPE_NUMBER 
    }
});

// Get all members
// GET /api/members
router.get('/', async (req, res) => {
    try {
        const conn = await getConnection();
        const result = await conn.execute(`
            SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, EMAIL
            FROM GP_LMS_MEMBERS
        `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }); // Use object format

        await conn.close();

        // Map results using object properties
        const members = result.rows.map(row => ({
            id: row.MEMBER_ID,
            firstName: row.FIRST_NAME,
            lastName: row.LAST_NAME,
            email: row.EMAIL
        }));

        res.json(members);
    } catch (err) {
        console.error('Error fetching members:', err);
        res.status(500).send('Failed to fetch members');
    }
});

// Check the logged-in member's info
// GET /api/members/me
router.get('/me', verifyToken, async (req, res) => {
    
    // Get ID from JWT payload (should be a string from the login function)
    const memberIdValue = req.user && req.user.id ? String(req.user.id) : null;

    if (!memberIdValue) {
        return res.status(401).json({ message: 'User ID missing in token' });
    }
    
    // Apply Type Binds with explicit Number conversion
    const binds = createMemberIdBind(memberIdValue);

    try {
        const conn = await getConnection();
        const result = await conn.execute(`
            SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, EMAIL
            FROM GP_LMS_MEMBERS
            WHERE MEMBER_ID = :memberId
        `, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT }); // Use object format for clarity

        await conn.close();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const member = result.rows[0];
        res.json({ id: member.MEMBER_ID, firstName: member.FIRST_NAME, lastName: member.LAST_NAME, email: member.EMAIL });
    } catch (err) {
        console.error('Error fetching member info (me):', err);
        res.status(500).send('Error fetching member info');
    }
});

// Update member information
// PUT /api/members/:id
router.put('/:id', verifyToken, async (req, res) => {
    // Get member ID from URL parameter
    const memberIdValue = req.params.id;
    // Get update data from request body
    const { firstName, lastName, email } = req.body;

    // Create ID binding object using the helper
    const idBinds = createMemberIdBind(memberIdValue);

    // Combine ID binding with update data bindings
    const updateBinds = {
        ...idBinds, 
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    // Simple validation for required fields
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'Missing required fields (firstName, lastName, email)' });
    }

    try {
        const conn = await getConnection();
        
        // Execute UPDATE query
        const result = await conn.execute(`
            UPDATE GP_LMS_MEMBERS
            SET FIRST_NAME = :firstName, LAST_NAME = :lastName, EMAIL = :email
            WHERE MEMBER_ID = :memberId
        `, updateBinds, { autoCommit: true }); 

        await conn.close();

        // Check if any row was updated
        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Member not found or no changes made' });
        }

        res.status(200).json({ message: 'Member updated successfully', id: memberIdValue });
    } catch (err) {
        console.error('Error updating member:', err);
        res.status(500).send('Failed to update member');
    }
});

// Delete a member
// DELETE /api/members/:id
router.delete('/:id', verifyToken, async (req, res) => {
    // Get member ID from URL parameter
    const memberIdValue = req.params.id;

    // Create ID binding object
    const binds = createMemberIdBind(memberIdValue);

    try {
        const conn = await getConnection();

        // Execute DELETE query
        const result = await conn.execute(`
            DELETE FROM GP_LMS_MEMBERS
            WHERE MEMBER_ID = :memberId
        `, binds, { autoCommit: true });

        await conn.close();

        // Check if any row was deleted
        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ message: 'Member deleted successfully', id: memberIdValue });
    } catch (err) {
        console.error('Error deleting member:', err);
        res.status(500).send('Failed to delete member');
    }
});

// Get member by ID
// GET /api/members/:id
router.get('/:id', verifyToken, async (req, res) => {
    const memberIdValue = req.params.id;
    const binds = createMemberIdBind(memberIdValue); // Apply Type Binds

    try {
        const conn = await getConnection();
        const result = await conn.execute(`
            SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, EMAIL
            FROM GP_LMS_MEMBERS
            WHERE MEMBER_ID = :memberId
        `, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT }); // Use object format

        await conn.close();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const member = result.rows[0];
        res.json({ id: member.MEMBER_ID, firstName: member.FIRST_NAME, lastName: member.LAST_NAME, email: member.EMAIL });
    } catch (err) {
        console.error('Error fetching member:', err);
        res.status(500).send('Failed to fetch member');
    }
});

// Get fines for a member
// GET /api/members/:id/fines
router.get('/:id/fines', async (req, res) => {
    const memberIdValue = req.params.id;
    const binds = createMemberIdBind(memberIdValue); // Apply Type Binds

    try {
        const conn = await getConnection();
        const result = await conn.execute(`
            SELECT f.FINE_ID, f.AMOUNT, f.PAID_DATE, l.LOAN_ID
            FROM GP_LMS_LOAN_FINES f
            JOIN GP_LMS_LOANS l ON f.LOAN_ID = l.LOAN_ID
            WHERE l.MEMBER_ID = :memberId
        `, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT }); // Use object format

        await conn.close();

        // Map results using object properties
        const fines = result.rows.map(row => ({
            fineId: row.FINE_ID,
            amount: row.AMOUNT,
            paidDate: row.PAID_DATE,
            loanId: row.LOAN_ID
        }));

        res.json(fines);
    } catch (err) {
        console.error('Error fetching fines:', err);
        res.status(500).send('Failed to fetch fines');
    }
});

// Get active loan count for a member
// GET /api/members/:memberId/loan-count
router.get('/:memberId/loan-count', async (req, res) => {
    const memberIdValue = req.params.memberId;
    const binds = createMemberIdBind(memberIdValue); // Apply Type Binds

    try {
        const conn = await getConnection();
        const result = await conn.execute(`
            SELECT COUNT(*) AS COUNT
            FROM GP_LMS_LOANS
            WHERE MEMBER_ID = :memberId AND RETURN_DATE IS NULL
        `, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT }); // Use object format

        await conn.close();

        // Access result using object property name
        const loanCount = result.rows[0].COUNT; 
        res.json({ memberId: memberIdValue, loanCount });
    } catch (err) {
        console.error('Failed to fetch loan count:', err);
        res.status(500).send('Error fetching loan count');
    }
});

export default router;
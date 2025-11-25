import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { getConnection } from '../db/oracle.js';

dotenv.config();

// ==========================================
// 1. Login Member
// ==========================================
export const loginMember = async (req, res) => {
  const { email, password } = req.body;

  try {
    const conn = await getConnection();
    
    // Fetch member details including ROLE
    const result = await conn.execute(
      `SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, PASSWORD_HASH, ROLE 
       FROM GP_LMS_MEMBERS 
       WHERE EMAIL = :email`,
      [email]
    );

    await conn.close();

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Oracle returns rows as arrays by default (unless object format is specified)
    const [memberId, firstName, lastName, passwordHash, role] = result.rows[0];

    // Verify Password
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT Token (include role in payload)
    const token = jwt.sign(
      { id: String(memberId), name: `${firstName} ${lastName}`, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Send response with Token, Role, and Name
    res.json({
      token,
      role: role || 'PATRON', // Default to PATRON if null
      name: `${firstName} ${lastName}`
    });

  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==========================================
// 2. Register Member (Public Sign Up)
// ==========================================
export const registerMember = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await getConnection();

    // [UPDATE] Default Role is now set to 'PATRON'
    // Users must be manually promoted to 'ADMIN' via SQL database access
    await conn.execute(
      `INSERT INTO GP_LMS_MEMBERS (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD_HASH, ROLE)
       VALUES (:fn, :ln, :em, :ph, 'PATRON')`, 
      { fn: firstName, ln: lastName, em: email, ph: hashedPassword },
      { autoCommit: true }
    );

    await conn.close();
    res.status(201).json({ message: 'Member registered successfully' });
    
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { getConnection } from '../db/oracle.js';

dotenv.config();

// Login with JWT
export const loginMember = async (req, res) => {
  const { email, password } = req.body;

  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT MEMBER_ID, FIRST_NAME, LAST_NAME, PASSWORD_HASH 
       FROM GP_LMS_MEMBERS 
       WHERE EMAIL = :email`,
      [email]
    );

    await conn.close();

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const [memberId, firstName, lastName, passwordHash] = result.rows[0];

    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: String(memberId), name: `${firstName} ${lastName}`, email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// register
export const registerMember = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await getConnection();

    await conn.execute(
      `INSERT INTO GP_LMS_MEMBERS (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD_HASH)
       VALUES (:firstName, :lastName, :email, :passwordHash)`,
      { firstName, lastName, email, passwordHash: hashedPassword },
      { autoCommit: true }
    );

    await conn.close();
    res.status(201).json({ message: 'Member registered successfully' });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

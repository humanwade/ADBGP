import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // debugging log
  console.log('Authorization header:', authHeader);
  console.log('Extracted token:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded token:', decoded); // important log for token

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Invalid token:', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
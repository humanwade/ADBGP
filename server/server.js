import dotenv from 'dotenv';
import express from './express.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

express.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

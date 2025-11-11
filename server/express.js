import express from 'express';
import cors from 'cors';
import booksRouter from './routes/books.js';
import loansRouter from './routes/loans.js';
import membersRouter from './routes/members.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/members', membersRouter);
app.use('/api/loans', loansRouter);

// for checking the root route
app.get('/', (req, res) => {
  res.send('GP-LMS Server Running!');
});

export default app;
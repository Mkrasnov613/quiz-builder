import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import quizzesRouter from './routes/quizzes';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
app.use(express.json());

app.use('/quizzes', quizzesRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

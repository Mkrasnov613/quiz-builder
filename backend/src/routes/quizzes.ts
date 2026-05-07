import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { CreateQuizDto } from '../types/quiz';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const body = req.body as CreateQuizDto;

  if (!body.title?.trim()) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  if (!Array.isArray(body.questions) || body.questions.length === 0) {
    res.status(400).json({ error: 'At least one question is required' });
    return;
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: body.title.trim(),
      questions: {
        create: body.questions.map((q) => ({
          text: q.text,
          type: q.type,
          correctAnswer: q.correctAnswer ?? null,
          options: q.options?.length
            ? { create: q.options.map((o) => ({ label: o.label, isCorrect: o.isCorrect })) }
            : undefined,
        })),
      },
    },
    include: { questions: { include: { options: true } } },
  });

  res.status(201).json(quiz);
});

router.get('/', async (_req: Request, res: Response) => {
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const result = quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    createdAt: q.createdAt,
    questionCount: q._count.questions,
  }));

  res.json(result);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: { include: { options: true } } },
  });

  if (!quiz) {
    res.status(404).json({ error: 'Quiz not found' });
    return;
  }

  res.json(quiz);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const existing = await prisma.quiz.findUnique({ where: { id } });

  if (!existing) {
    res.status(404).json({ error: 'Quiz not found' });
    return;
  }

  await prisma.quiz.delete({ where: { id } });
  res.status(204).send();
});

export default router;

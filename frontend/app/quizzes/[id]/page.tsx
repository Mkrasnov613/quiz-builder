'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { Quiz } from '@/types/quiz';
import QuestionCard from '@/components/QuestionCard';

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getQuiz(Number(id))
      .then(setQuiz)
      .catch(() => setError('Quiz not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-text-muted">Loading...</p>;
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-danger mb-4">{error}</p>
        <Link href="/quizzes" className="text-primary hover:underline text-sm">
          Back to quizzes
        </Link>
      </div>
    );
  }
  if (!quiz) return null;

  return (
    <div>
      <Link href="/quizzes" className="text-sm text-primary hover:underline mb-6 inline-block">
        ← Back to quizzes
      </Link>

      <h1 className="text-3xl font-bold text-text mb-2">{quiz.title}</h1>
      <p className="text-sm text-text-muted mb-8">
        {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
      </p>

      <div className="space-y-4">
        {quiz.questions.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i} />
        ))}
      </div>
    </div>
  );
}

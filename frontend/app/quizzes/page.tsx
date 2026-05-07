'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';
import { QuizSummary } from '@/types/quiz';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    api
      .getQuizzes()
      .then(setQuizzes)
      .catch(() => setError('Failed to load quizzes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await api.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch {
      setError('Failed to delete quiz.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <p className="text-text-muted">Loading quizzes...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">All Quizzes</h1>
      </div>

      {error && <p className="text-danger mb-4 text-sm">{error}</p>}

      {quizzes.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg mb-2">No quizzes yet.</p>
          <Link href="/create" className="text-primary hover:underline text-sm">
            Create your first quiz
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="bg-gradient-card border border-border-muted rounded-lg px-5 py-4 flex items-center justify-between hover:border-border transition-colors"
            >
              <Link href={`/quizzes/${quiz.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-text truncate">{quiz.title}</p>
                <p className="text-sm text-text-muted mt-0.5">
                  {quiz.questionCount} question{quiz.questionCount !== 1 ? 's' : ''}
                </p>
              </Link>

              <button
                onClick={() => handleDelete(quiz.id)}
                disabled={deleting === quiz.id}
                aria-label={`Delete ${quiz.title}`}
                className="ml-4 p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors disabled:opacity-50"
              >
                {deleting === quiz.id ? (
                  <span className="text-xs">...</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

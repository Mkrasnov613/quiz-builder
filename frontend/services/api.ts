import { Quiz, QuizSummary, CreateQuizDto } from '@/types/quiz';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getQuizzes: () => request<QuizSummary[]>('/quizzes'),
  getQuiz: (id: number) => request<Quiz>(`/quizzes/${id}`),
  createQuiz: (data: CreateQuizDto) =>
    request<Quiz>('/quizzes', { method: 'POST', body: JSON.stringify(data) }),
  deleteQuiz: (id: number) => request<void>(`/quizzes/${id}`, { method: 'DELETE' }),
};

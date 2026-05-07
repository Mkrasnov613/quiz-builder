'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { QuestionEditor } from './components/QuestionEditor';
import { QuestionDraft, CreateOptionDto } from '@/types/quiz';

let _uid = 0;
const uid = () => ++_uid;

const defaultQuestion = (): QuestionDraft => ({
  _id: uid(),
  text: '',
  type: 'BOOLEAN',
  correctAnswer: '',
  options: [],
});

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionDraft[]>([defaultQuestion()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => setQuestions((prev) => [...prev, defaultQuestion()]);

  const removeQuestion = (id: number) => setQuestions((prev) => prev.filter((q) => q._id !== id));

  const updateQuestion = (id: number, patch: Partial<QuestionDraft>) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === id
          ? {
              ...q,
              ...patch,
              options: patch.type && patch.type !== q.type ? [] : (patch.options ?? q.options),
              correctAnswer:
                patch.type && patch.type !== q.type
                  ? ''
                  : patch.correctAnswer !== undefined
                    ? patch.correctAnswer
                    : q.correctAnswer,
            }
          : q,
      ),
    );

  const addOption = (qId: number) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === qId ? { ...q, options: [...q.options, { label: '', isCorrect: false }] } : q,
      ),
    );

  const updateOption = (qId: number, idx: number, patch: Partial<CreateOptionDto>) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === qId
          ? { ...q, options: q.options.map((o, i) => (i === idx ? { ...o, ...patch } : o)) }
          : q,
      ),
    );

  const removeOption = (qId: number, idx: number) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === qId ? { ...q, options: q.options.filter((_, i) => i !== idx) } : q,
      ),
    );

  const validate = () => {
    if (!title.trim()) return 'Quiz title is required.';
    for (const q of questions) {
      if (!q.text.trim()) return 'Every question must have text.';
      if (q.type === 'BOOLEAN' && !q.correctAnswer)
        return 'Select the correct answer for every True / False question.';
      if (q.type === 'INPUT' && !q.correctAnswer?.trim())
        return 'Provide the correct answer for every short answer question.';
      if (q.type === 'CHECKBOX') {
        if (q.options.length < 2) return 'Checkbox questions need at least 2 options.';
        if (!q.options.some((o) => o.isCorrect))
          return 'Checkbox questions need at least 1 correct answer.';
        if (q.options.some((o) => !o.label.trim())) return 'All option labels must be filled in.';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const quiz = await api.createQuiz({
        title: title.trim(),
        questions: questions.map(({ _id: _, ...q }) => ({
          ...q,
          options: q.type === 'CHECKBOX' ? q.options : undefined,
        })),
      });
      router.push(`/quizzes/${quiz.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">Create a Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="title">
            Quiz Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. JavaScript Basics"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text bg-bg-light focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text-muted/50"
          />
        </div>

        <div className="space-y-4">
          {questions.map((q, qi) => (
            <QuestionEditor
              key={q._id}
              question={q}
              index={qi}
              canRemove={questions.length > 1}
              onUpdate={(patch) => updateQuestion(q._id, patch)}
              onRemove={() => removeQuestion(q._id)}
              onAddOption={() => addOption(q._id)}
              onUpdateOption={(idx, patch) => updateOption(q._id, idx, patch)}
              onRemoveOption={(idx) => removeOption(q._id, idx)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="w-full border-2 cursor-pointer border-dashed border-border rounded-lg py-3 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
        >
          + Add Question
        </button>

        {error && <p className="text-danger text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-btn-secondary cursor-pointer text-bg-dark py-2.5 rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
}

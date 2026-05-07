'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { CreateQuestionDto, CreateOptionDto, QuestionType } from '@/types/quiz';

interface QuestionDraft extends CreateQuestionDto {
  _id: number;
  options: CreateOptionDto[];
}

let _uid = 0;
const uid = () => ++_uid;

const defaultQuestion = (): QuestionDraft => ({
  _id: uid(),
  text: '',
  type: 'BOOLEAN',
  options: [],
});

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionDraft[]>([defaultQuestion()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => setQuestions((prev) => [...prev, defaultQuestion()]);

  const removeQuestion = (id: number) =>
    setQuestions((prev) => prev.filter((q) => q._id !== id));

  const updateQuestion = (id: number, patch: Partial<QuestionDraft>) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === id
          ? {
              ...q,
              ...patch,
              options: patch.type && patch.type !== q.type ? [] : (patch.options ?? q.options),
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            Quiz Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. JavaScript Basics"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        >
          + Add Question
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
}

interface QuestionEditorProps {
  question: QuestionDraft;
  index: number;
  canRemove: boolean;
  onUpdate: (patch: Partial<QuestionDraft>) => void;
  onRemove: () => void;
  onAddOption: () => void;
  onUpdateOption: (idx: number, patch: Partial<CreateOptionDto>) => void;
  onRemoveOption: (idx: number) => void;
}

function QuestionEditor({
  question,
  index,
  canRemove,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: QuestionEditorProps) {
  const TYPE_LABELS: Record<QuestionType, string> = {
    BOOLEAN: 'True / False',
    INPUT: 'Short Answer',
    CHECKBOX: 'Multiple Choice',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500">Question {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      <input
        type="text"
        value={question.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Question text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex gap-2">
        {(['BOOLEAN', 'INPUT', 'CHECKBOX'] as QuestionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onUpdate({ type: t })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              question.type === t
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {question.type === 'BOOLEAN' && (
        <p className="text-xs text-gray-400 italic">Students answer True or False.</p>
      )}

      {question.type === 'INPUT' && (
        <p className="text-xs text-gray-400 italic">Students type a short text answer.</p>
      )}

      {question.type === 'CHECKBOX' && (
        <div className="space-y-2">
          {question.options.map((opt, oi) => (
            <div key={oi} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={opt.isCorrect}
                onChange={(e) => onUpdateOption(oi, { isCorrect: e.target.checked })}
                className="w-4 h-4 accent-indigo-600"
                title="Mark as correct"
              />
              <input
                type="text"
                value={opt.label}
                onChange={(e) => onUpdateOption(oi, { label: e.target.value })}
                placeholder={`Option ${oi + 1}`}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => onRemoveOption(oi)}
                className="text-gray-300 hover:text-red-400 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onAddOption}
            className="text-xs text-indigo-600 hover:underline"
          >
            + Add option
          </button>
        </div>
      )}
    </div>
  );
}

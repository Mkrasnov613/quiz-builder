import { QuestionDraft, CreateOptionDto, QuestionType } from '@/types/quiz';

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

const TYPE_LABELS: Record<QuestionType, string> = {
  BOOLEAN: 'True / False',
  INPUT: 'Short Answer',
  CHECKBOX: 'Multiple Choice',
};

export function QuestionEditor({
  question,
  index,
  canRemove,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: QuestionEditorProps) {
  return (
    <div className="bg-gradient-card border-t-highlight border border-border-muted rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-muted">Question {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-danger/70 hover:text-danger transition-colors"
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
        className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text bg-bg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text-muted/50"
      />

      <div className="flex gap-2">
        {(['BOOLEAN', 'INPUT', 'CHECKBOX'] as QuestionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onUpdate({ type: t })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
              question.type === t
                ? 'bg-gradient-card text-text border border-border-muted border-t-highlight'
                : 'bg-bg text-text-muted border-border hover:border-border-muted hover:text-text hover:border-t-highlight'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {question.type === 'BOOLEAN' && (
        <div className="flex gap-4">
          {(['true', 'false'] as const).map((val) => (
            <label key={val} className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="radio"
                name={`boolean-${question._id}`}
                checked={question.correctAnswer === val}
                onChange={() => onUpdate({ correctAnswer: val })}
                className="accent-primary"
              />
              <span
                className={
                  question.correctAnswer === val ? 'text-text font-medium' : 'text-text-muted'
                }
              >
                {val === 'true' ? 'True' : 'False'}
              </span>
            </label>
          ))}
          <span className="text-xs text-text-muted/50 italic self-center ml-1">
            — correct answer
          </span>
        </div>
      )}

      {question.type === 'INPUT' && (
        <div>
          <label className="text-xs text-text-muted mb-1 block">Correct answer</label>
          <input
            type="text"
            value={question.correctAnswer ?? ''}
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            placeholder="Expected answer"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text bg-bg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text-muted/50"
          />
        </div>
      )}

      {question.type === 'CHECKBOX' && (
        <div className="space-y-2">
          {question.options.map((opt, oi) => (
            <div key={oi} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={opt.isCorrect}
                onChange={(e) => onUpdateOption(oi, { isCorrect: e.target.checked })}
                className="w-4 h-4 accent-primary"
                title="Mark as correct"
              />
              <input
                type="text"
                value={opt.label}
                onChange={(e) => onUpdateOption(oi, { label: e.target.value })}
                placeholder={`Option ${oi + 1}`}
                className="flex-1 border border-border rounded px-2 py-1 text-sm text-text bg-bg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text-muted/50"
              />
              <button
                type="button"
                onClick={() => onRemoveOption(oi)}
                className="text-text-muted/40 hover:text-danger text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onAddOption}
            className="text-xs text-primary hover:underline"
          >
            + Add option
          </button>
        </div>
      )}
    </div>
  );
}

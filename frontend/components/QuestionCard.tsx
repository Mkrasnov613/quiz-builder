import { Question } from '@/types/quiz';

interface Props {
  question: Question;
  index: number;
}

export default function QuestionCard({ question, index }: Props) {
  return (
    <div className="border border-border-muted rounded-lg p-4 bg-gradient-card">
      <p className="text-sm text-text-muted font-medium mb-1">
        Q{index + 1} &middot; {question.type}
      </p>
      <p className="font-medium text-text mb-3">{question.text}</p>

      {question.type === 'BOOLEAN' && (
        <div className="flex gap-4 text-sm">
          {(['true', 'false'] as const).map((val) => {
            const isCorrect = question.correctAnswer === val;
            return (
              <span
                key={val}
                className={`flex items-center gap-1.5 ${isCorrect ? 'text-success font-medium' : 'text-text-muted'}`}
              >
                <span
                  className={`w-4 h-4 rounded-full border inline-block ${isCorrect ? 'bg-success border-success' : 'border-border'}`}
                />
                {val === 'true' ? 'True' : 'False'}
              </span>
            );
          })}
        </div>
      )}

      {question.type === 'INPUT' && (
        <div className="flex border-b border-border w-full text-sm flex-col items-start pb-1 gap-1">
          <p className="text-text-muted/50 text-xs">Answer:</p>
          <p
            className={`block break-all ${question.correctAnswer ? 'text-success' : 'text-text-muted/40 italic'}`}
          >
            {question.correctAnswer || 'not set'}
          </p>
        </div>
      )}

      {question.type === 'CHECKBOX' && question.options.length > 0 && (
        <ul className="space-y-1.5">
          {question.options.map((opt) => (
            <li key={opt.id} className="flex items-center gap-2 text-sm">
              <span
                className={`w-4 h-4 rounded border shrink-0 ${opt.isCorrect ? 'bg-success border-success' : 'border-border'}`}
              />
              <span className={opt.isCorrect ? 'text-success font-medium' : 'text-text-muted'}>
                {opt.label}
              </span>
              {opt.isCorrect && <span className="text-xs text-success ml-auto">correct</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

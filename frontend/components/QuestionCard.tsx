import { Question } from '@/types/quiz';

interface Props {
  question: Question;
  index: number;
}

export default function QuestionCard({ question, index }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <p className="text-sm text-gray-400 font-medium mb-1">
        Q{index + 1} &middot; {question.type}
      </p>
      <p className="font-medium text-gray-800 mb-3">{question.text}</p>

      {question.type === 'BOOLEAN' && (
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-4 h-4 rounded-full border border-gray-400 inline-block" />
            True
          </span>
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-4 h-4 rounded-full border border-gray-400 inline-block" />
            False
          </span>
        </div>
      )}

      {question.type === 'INPUT' && (
        <div className="h-8 border-b border-gray-300 w-full max-w-xs text-sm text-gray-400 flex items-end pb-1">
          Short text answer
        </div>
      )}

      {question.type === 'CHECKBOX' && question.options.length > 0 && (
        <ul className="space-y-1.5">
          {question.options.map((opt) => (
            <li key={opt.id} className="flex items-center gap-2 text-sm">
              <span
                className={`w-4 h-4 rounded border flex-shrink-0 ${opt.isCorrect ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}
              />
              <span className={opt.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}>
                {opt.label}
              </span>
              {opt.isCorrect && (
                <span className="text-xs text-green-600 ml-auto">correct</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

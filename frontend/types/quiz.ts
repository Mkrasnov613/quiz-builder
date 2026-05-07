export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface Option {
  id: number;
  label: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  correctAnswer?: string | null;
  options: Option[];
}

export interface Quiz {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
}

export interface QuizSummary {
  id: number;
  title: string;
  createdAt: string;
  questionCount: number;
}

export interface CreateOptionDto {
  label: string;
  isCorrect: boolean;
}

export interface CreateQuestionDto {
  text: string;
  type: QuestionType;
  correctAnswer?: string;
  options?: CreateOptionDto[];
}

export interface CreateQuizDto {
  title: string;
  questions: CreateQuestionDto[];
}

export interface QuestionDraft extends CreateQuestionDto {
  _id: number;
  options: CreateOptionDto[];
}

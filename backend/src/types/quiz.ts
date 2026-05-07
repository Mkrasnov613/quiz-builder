export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface CreateOptionDto {
  label: string;
  isCorrect: boolean;
}

export interface CreateQuestionDto {
  text: string;
  type: QuestionType;
  options?: CreateOptionDto[];
}

export interface CreateQuizDto {
  title: string;
  questions: CreateQuestionDto[];
}

export interface UserInfo {
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  company_role?: string;
}

export interface QuizOption {
  text?: string;
  label?: string;
  value: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  category?: string;
  options: QuizOption[];
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  questions: QuizQuestion[];
}

export type QuizResults = Record<string, number>;

export interface CybersecurityInterest {
  reason: string;
  otherReason?: string;
}

export type InterestOption =
  | "process"
  | "nothing"
  | "curiosity"
  | "requirement"
  | "other";

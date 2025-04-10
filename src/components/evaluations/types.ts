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
  | "other"
  | "advanced";

export interface Category {
  name: string;
  score: number;
  maxScore: number;
}

export interface CybersecurityResultsProps {
  quizData: QuizData;
  results: QuizResults;
  userInfo: UserInfo;
  onRestart: () => void;
  isSharedView?: boolean;
  interest?: InterestOption;
  evaluationId?: string;
  score: number;
  maxScore: number;
  maturityLevel: string;
  maturityDescription: string;
  categories: Category[];
}

export interface MaturityLevel {
  level: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  advice?: string;
}

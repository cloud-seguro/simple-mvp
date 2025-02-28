export type QuizOption = {
    label: string
    value: number
  }
  
  export type Question = {
    id: string
    text: string
    options: QuizOption[]
    category?: string
  }
  
  export type QuizData = {
    id: string
    title: string
    description: string
    instructions: string
    questions: Question[]
  }
  
  export type QuizResults = {
    [questionId: string]: number
  }
  
  
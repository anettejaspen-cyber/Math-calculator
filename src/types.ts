export interface MathStep {
  step: number;
  title: string;
  expression: string;
  explanation: string;
  tip?: string;
}

export interface PracticeMatch {
  question: string;
  hint: string;
}

export interface MathSolution {
  problem: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  keyConcepts: string[];
  finalAnswer: string;
  steps: MathStep[];
  practiceMatches: PracticeMatch[];
}

export interface SolutionHistoryItem {
  id: string;
  timestamp: string;
  problem: string;
  category: string;
  isFavorite: boolean;
  solution: MathSolution;
}

export interface MathFormula {
  name: string;
  equation: string;
  description: string;
  category: "Algebra" | "Geometry" | "Calculus" | "Trig" | "Physics";
  calculatorInsert: string;
}

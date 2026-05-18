// Question types - 7 types matching the spec
export type QuestionType = 
  | 'situational_decision'    // T1: 情境决策题
  | 'premise_identification'  // T2: 前提识别题
  | 'perspective_switching'   // T3: 视角切换题
  | 'concept_distinction'     // T4: 概念辨析题
  | 'argument_evaluation'     // T5: 论证评估题
  | 'counterexample'          // T6: 反例构造题
  | 'comprehensive'           // T7: 综合应用题

// Dimension mapping
export type Dimension = 
  | '价值判断力'
  | '逻辑严谨性'
  | '共情中立性'
  | '知识精确性'
  | '批判性思维'
  | '思维深度'
  | '融会贯通'

export interface QuestionOption {
  text: string
  score: number // 1-5
  dimension?: Dimension
  explanation?: string
}

export interface Question {
  id: string
  type: QuestionType
  category: string        // Display name like "情境决策"
  dimension: Dimension
  difficulty: number      // 0.0 - 1.0
  text: string            // Main question text
  scenario?: string       // For T1, T7: context/situation
  options: QuestionOption[]
  extension?: string      // For T1: follow-up question
  hints?: string[]        // For T6: optional hints
  subtasks?: string[]     // For T7: sub-tasks
}

// User's answer to a question
export interface UserAnswer {
  questionId: string
  selectedOptions: number[]  // indices of selected options
  textAnswer?: string        // for open-ended questions
  timeSpent: number          // seconds
  score?: number
}

// Quiz session state
export interface QuizSession {
  id: string
  startedAt: number
  completedAt?: number
  answers: UserAnswer[]
  currentIndex: number
}

// Personality scores (our 7 dimensions)
export interface DimensionScore {
  dimension: Dimension
  score: number       // 0-100
  confidence: number  // 0-100
}

export interface PersonalityScores {
  dimensions: Record<Dimension, {
    score: number
    confidence: number
  }>
  overallScore: number
}

// Profile for a user
export interface UserProfile {
  id: string
  createdAt: number
  updatedAt: number
  summary?: string
  dimensionScores: DimensionScore[]
}

// Weakness item
export interface WeaknessItem {
  dimension: Dimension
  score: number
  confidence: number
  description: string
  suggestions: string[]
  resources: string[]
  status: 'pending' | 'in_progress' | 'improved'
}

// Navigation
export type NavItem = 'home' | 'quiz' | 'profile' | 'weakness' | 'settings'

export interface NavState {
  active: NavItem
  collapsed: boolean
}
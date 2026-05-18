import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question, DimensionScore } from '../lib/types'

interface QuizState {
  currentQuestionIndex: number
  answers: Record<string, number | string>
  questionQueue: Question[]
  isCompleted: boolean
  startTime: number | null
  
  // Actions
  setQuestions: (questions: Question[]) => void
  answerQuestion: (questionId: string, answer: number | string) => void
  nextQuestion: () => void
  resetQuiz: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuestionIndex: 0,
      answers: {},
      questionQueue: [],
      isCompleted: false,
      startTime: null,
      
      setQuestions: (questions) => set({ 
        questionQueue: questions,
        currentQuestionIndex: 0,
        answers: {},
        isCompleted: false,
        startTime: Date.now()
      }),
      
      answerQuestion: (questionId, answer) => set((state) => ({
        answers: { ...state.answers, [questionId]: answer }
      })),
      
      nextQuestion: () => {
        const { currentQuestionIndex, questionQueue } = get()
        if (currentQuestionIndex < questionQueue.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 })
        } else {
          set({ isCompleted: true })
        }
      },
      
      resetQuiz: () => set({
        currentQuestionIndex: 0,
        answers: {},
        questionQueue: [],
        isCompleted: false,
        startTime: null
      })
    }),
    {
      name: 'mirror-quiz-storage',
      partialize: (state) => ({
        // Only persist completed quiz history, not in-progress
        answers: state.isCompleted ? state.answers : {},
        questionQueue: state.isCompleted ? state.questionQueue : [],
      })
    }
  )
)

// Quiz history record
export interface QuizHistory {
  id: string
  date: number
  questionCount: number
  dimensionScores: DimensionScore[]
  overallScore: number
  summary: string
}

// Quiz history store
interface HistoryState {
  history: QuizHistory[]
  addRecord: (record: QuizHistory) => void
  clearHistory: () => void
}

export const useQuizHistory = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      
      addRecord: (record) => set((state) => ({
        history: [record, ...state.history].slice(0, 10) // Keep last 10
      })),
      
      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'mirror-quiz-history'
    }
  )
)
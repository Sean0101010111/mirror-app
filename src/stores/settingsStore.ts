import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  theme: 'light' | 'dark'
  questionCount: number
  showFeedback: boolean
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void
  setQuestionCount: (count: number) => void
  setShowFeedback: (show: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      questionCount: 10,
      showFeedback: true,
      
      setTheme: (theme) => set({ theme }),
      setQuestionCount: (count) => set({ questionCount: count }),
      setShowFeedback: (show) => set({ showFeedback: show })
    }),
    {
      name: 'mirror-settings'
    }
  )
)
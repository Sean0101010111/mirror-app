import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DimensionScore, Dimension } from '../lib/types'

interface ProfileSnapshot {
  id: string
  date: number
  summary: string | null
  dimensionScores: DimensionScore[]
  overallScore: number
}

interface ProfileState {
  profileId: string | null
  createdAt: number | null
  updatedAt: number | null
  summary: string | null
  dimensionScores: DimensionScore[]
  profileHistory: ProfileSnapshot[]
  
  // Actions
  setProfile: (profile: Partial<ProfileState>) => void
  setDimensionScores: (scores: DimensionScore[], summary?: string | null) => void
  updateDimensionScore: (dimension: string, score: number, confidence: number) => void
  saveSnapshot: () => void
  clearProfile: () => void
}

function calculateOverall(scores: DimensionScore[]): number {
  if (scores.length === 0) return 0
  const total = scores.reduce((sum, s) => sum + s.score, 0)
  return Math.round(total / scores.length)
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profileId: null,
      createdAt: null,
      updatedAt: null,
      summary: null,
      dimensionScores: [],
      profileHistory: [],
      
      setProfile: (profile) => set((state) => ({
        ...state,
        ...profile,
        updatedAt: Date.now()
      })),
      
      setDimensionScores: (scores, summary) => set((state) => {
        // Save current profile as snapshot before updating
        const snapshot: ProfileSnapshot | null = state.dimensionScores.length > 0 ? {
          id: state.profileId || `snapshot-${state.updatedAt || Date.now()}`,
          date: state.updatedAt || Date.now(),
          summary: state.summary,
          dimensionScores: state.dimensionScores,
          overallScore: calculateOverall(state.dimensionScores)
        } : null
        
        const newHistory = snapshot 
          ? [...state.profileHistory, snapshot].slice(-10) // Keep last 10
          : state.profileHistory
        
        return {
          ...state,
          dimensionScores: scores,
          summary: summary || state.summary,
          updatedAt: Date.now(),
          profileHistory: newHistory
        }
      }),
      
      updateDimensionScore: (dimension, score, confidence) => set((state) => {
        const existing = state.dimensionScores.find(d => d.dimension === dimension)
        if (existing) {
          return {
            dimensionScores: state.dimensionScores.map(d => 
              d.dimension === dimension ? { ...d, score, confidence } : d
            )
          }
        }
        return {
          dimensionScores: [...state.dimensionScores, { dimension: dimension as Dimension, score, confidence }]
        }
      }),
      
      saveSnapshot: () => set((state) => {
        if (state.dimensionScores.length === 0) return state
        
        const snapshot: ProfileSnapshot = {
          id: state.profileId || `snapshot-${Date.now()}`,
          date: Date.now(),
          summary: state.summary,
          dimensionScores: state.dimensionScores,
          overallScore: calculateOverall(state.dimensionScores)
        }
        
        return {
          profileHistory: [...state.profileHistory, snapshot].slice(-10)
        }
      }),
      
      clearProfile: () => set({
        profileId: null,
        createdAt: null,
        updatedAt: null,
        summary: null,
        dimensionScores: [],
        profileHistory: []
      })
    }),
    {
      name: 'mirror-profile-storage'
    }
  )
)
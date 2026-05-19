import type { Question } from '../lib/types'
import { questionBank as localQuestionBank } from '../data/questions'

// ============================================
// Types
// ============================================

export interface QuestionBankMeta {
  version: string
  lastUpdated: string
  totalQuestions: number
  dimensions: string[]
}

export interface QuestionBank {
  meta: QuestionBankMeta
  questions: Question[]
}

export interface UpdateCheckResult {
  hasUpdate: boolean
  currentVersion: string | null
  latestVersion: string | null
  lastChecked: string
}

export interface DiffResult {
  meta: QuestionBankMeta
  added: Question[]
  removed: string[]  // question IDs
  updated: Question[]
}

export interface AutoUpdateResult {
  success: boolean
  updated: boolean
  previousVersion: string | null
  newVersion: string | null
  error?: string
}

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEYS = {
  QUESTION_BANK: 'mirror-question-bank',
  QUESTION_META: 'mirror-question-meta',
  API_URL: 'mirror-api-url',
  LAST_SYNC: 'mirror-last-sync',
  AUTO_SYNC: 'mirror-auto-sync',
  LAST_AUTO_CHECK: 'mirror-last-auto-check',
}

// ============================================
// Default API URL (can be configured by user)
// ============================================

// GitHub raw content URL for question bank updates
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Sean0101010111/mirror-app/main'

// ============================================
// Local Cache Management
// ============================================

export function getApiUrl(): string {
  // Legacy function - API URL is now hardcoded to GitHub raw content
  return localStorage.getItem(STORAGE_KEYS.API_URL) || GITHUB_RAW_URL
}

export function setApiUrl(url: string): void {
  localStorage.setItem(STORAGE_KEYS.API_URL, url)
}

export function isAutoSyncEnabled(): boolean {
  // Default to true if not set
  const stored = localStorage.getItem(STORAGE_KEYS.AUTO_SYNC)
  return stored === null ? true : stored === 'true'
}

export function setAutoSync(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.AUTO_SYNC, enabled ? 'true' : 'false')
}

export function getLocalVersion(): string | null {
  return localStorage.getItem(STORAGE_KEYS.QUESTION_META)
    ? JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTION_META)!).version
    : null
}

export function getLastSyncTime(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
}

export function getLastAutoCheckTime(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_AUTO_CHECK)
}

export function getCachedQuestionBank(): QuestionBank | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.QUESTION_BANK)
    const metaStr = localStorage.getItem(STORAGE_KEYS.QUESTION_META)
    if (cached && metaStr) {
      return {
        meta: JSON.parse(metaStr),
        questions: JSON.parse(cached)
      }
    }
  } catch (e) {
    console.error('Failed to load cached question bank:', e)
  }
  return null
}

export function saveToCache(questions: Question[], meta: QuestionBankMeta): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTION_BANK, JSON.stringify(questions))
    localStorage.setItem(STORAGE_KEYS.QUESTION_META, JSON.stringify(meta))
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString())
  } catch (e) {
    console.error('Failed to save question bank to cache:', e)
  }
}

// ============================================
// API Calls
// ============================================

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const apiUrl = getApiUrl()
  const url = `${apiUrl}${endpoint}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    // Timeout after 10 seconds
    signal: AbortSignal.timeout(10000),
  })
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

// ============================================
// Core Functions
// ============================================

/**
 * Check if there's an update available (by comparing meta versions)
 */
export async function checkForUpdates(): Promise<UpdateCheckResult> {
  const currentVersion = getLocalVersion()
  const now = new Date().toISOString()
  
  try {
    // Check version from GitHub raw content
    const response = await fetch(`${GITHUB_RAW_URL}/api/data/meta.json`, {
      signal: AbortSignal.timeout(10000)
    })
    
    if (response.ok) {
      const meta = await response.json() as { version: string; lastUpdated: string }
      return {
        hasUpdate: currentVersion !== meta.version,
        currentVersion,
        latestVersion: meta.version,
        lastChecked: now,
      }
    }
  } catch (e) {
    console.error('Failed to check for updates:', e)
  }
  
  return {
    hasUpdate: false,
    currentVersion,
    latestVersion: null,
    lastChecked: now,
  }
}

/**
 * Fetch complete question bank
 * Priority: GitHub raw (online updates) > local cache > bundled questions
 */
export async function fetchQuestionBank(): Promise<QuestionBank> {
  // 1. Try to fetch from GitHub raw content (supports online updates)
  try {
    const response = await fetch(`${GITHUB_RAW_URL}/api/data/questions.json`, {
      signal: AbortSignal.timeout(10000)
    })
    if (response.ok) {
      const data = await response.json() as QuestionBank
      saveToCache(data.questions, data.meta)
      console.log('Loaded questions from GitHub:', data.questions.length)
      return data
    }
  } catch (e) {
    console.log('GitHub fetch failed, trying local cache...')
  }

  // 2. Fall back to local cache
  const cached = getCachedQuestionBank()
  if (cached) {
    return cached
  }

  // 3. Last resort: use bundled local questions
  console.warn('No cache available, using bundled local questions')
  return {
    meta: {
      version: 'local-v1.0.0',
      lastUpdated: new Date().toISOString(),
      totalQuestions: localQuestionBank.length,
      dimensions: ['价值判断力', '逻辑严谨性', '共情中立性', '知识精确性', '批判性思维', '思维深度', '融会贯通'],
    },
    questions: localQuestionBank,
  }
}

/**
 * Fetch incremental update since a specific version
 */
export async function fetchIncrementalUpdate(sinceVersion: string): Promise<DiffResult | null> {
  try {
    const data = await fetchFromApi<DiffResult>(`/api/questions/diff?since=${encodeURIComponent(sinceVersion)}`)
    return data
  } catch (e) {
    console.error('Failed to fetch incremental update:', e)
    return null
  }
}

/**
 * Get questions to use for quiz
 * Prioritizes: cached questions > bundled local questions
 */
export async function getQuestions(): Promise<QuestionBank> {
  // If we have a cached question bank, use it
  const cached = getCachedQuestionBank()
  if (cached) {
    return cached
  }
  
  // Otherwise fetch from API or use local
  return fetchQuestionBank()
}

// ============================================
// Auto Update on Login
// ============================================

/**
 * Automatically check and download updates on app startup
 * Returns result indicating whether an update occurred
 */
export async function autoUpdateOnLogin(): Promise<AutoUpdateResult> {
  const previousVersion = getLocalVersion()
  const now = new Date().toISOString()
  
  // Record this auto-check time
  localStorage.setItem(STORAGE_KEYS.LAST_AUTO_CHECK, now)
  
  // Check if auto-sync is enabled
  if (!isAutoSyncEnabled()) {
    return {
      success: true,
      updated: false,
      previousVersion,
      newVersion: previousVersion,
    }
  }
  
  try {
    // First check if there's an update
    const checkResult = await checkForUpdates()
    
    if (checkResult.hasUpdate) {
      console.log(`Question bank update available: ${checkResult.currentVersion} -> ${checkResult.latestVersion}`)
      
      // Download the update
      const newBank = await fetchQuestionBank()
      
      return {
        success: true,
        updated: true,
        previousVersion,
        newVersion: newBank.meta.version,
      }
    }
    
    return {
      success: true,
      updated: false,
      previousVersion,
      newVersion: previousVersion,
    }
  } catch (e) {
    console.error('Auto-update failed:', e)
    return {
      success: false,
      updated: false,
      previousVersion,
      newVersion: previousVersion,
      error: e instanceof Error ? e.message : 'Unknown error',
    }
  }
}

// ============================================
// Update Notifications
// ============================================

export interface UpdateNotification {
  type: 'available' | 'downloading' | 'ready' | 'error'
  message: string
  version?: string
}

/**
 * Download and cache new question bank
 * Returns the new question bank when ready
 */
export async function downloadUpdate(): Promise<QuestionBank> {
  // For now, just do a full fetch since we don't have proper diff support
  // In production, this would use fetchIncrementalUpdate
  const newBank = await fetchQuestionBank()
  return newBank
}

// ============================================
// Version Info Display
// ============================================

export function getVersionInfo(): {
  version: string
  lastUpdated: string
  source: 'api' | 'cache' | 'local'
  lastAutoCheck: string | null
} {
  const cached = getCachedQuestionBank()
  if (cached) {
    return {
      version: cached.meta.version,
      lastUpdated: cached.meta.lastUpdated,
      source: 'cache',
      lastAutoCheck: getLastAutoCheckTime(),
    }
  }
  
  return {
    version: 'local-v1.0.0',
    lastUpdated: new Date().toISOString(),
    source: 'local',
    lastAutoCheck: getLastAutoCheckTime(),
  }
}
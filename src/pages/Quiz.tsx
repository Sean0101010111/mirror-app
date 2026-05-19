import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore, useQuizHistory } from '../stores/quizStore'
import { useProfileStore } from '../stores/profileStore'
import { useSettingsStore } from '../stores/settingsStore'
import { getQuestions } from '../services/questionSync'
import { calculateDimensionScores, getOverallScore, generateSummary } from '../services/profiling'
import './Quiz.css'

export default function Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  
  const { 
    currentQuestionIndex, 
    questionQueue, 
    answers,
    isCompleted,
    setQuestions,
    answerQuestion,
    nextQuestion,
    resetQuiz
  } = useQuizStore()

  const { setDimensionScores, setProfile } = useProfileStore()
  const { addRecord } = useQuizHistory()
  const { questionCount } = useSettingsStore()

  const handleStartQuiz = async () => {
    setIsLoading(true)
    setLoadingError(null)
    
    try {
      // Try to load questions from remote API (with fallback to local)
      const questionBank = await getQuestions()
      
      // Stratified sampling: ensure at least 2 questions per dimension
      const MIN_PER_DIMENSION = 2
      const dimensionGroups: Record<string, typeof questionBank.questions> = {}
      
      // Group questions by dimension
      questionBank.questions.forEach(q => {
        if (!dimensionGroups[q.dimension]) {
          dimensionGroups[q.dimension] = []
        }
        dimensionGroups[q.dimension].push(q)
      })
      
      // Select minimum questions from each dimension first
      const selectedQuestions: typeof questionBank.questions = []
      const dimensions = Object.keys(dimensionGroups)
      
      dimensions.forEach(dim => {
        const dimQuestions = dimensionGroups[dim].sort(() => Math.random() - 0.5)
        const count = Math.min(MIN_PER_DIMENSION, dimQuestions.length)
        selectedQuestions.push(...dimQuestions.slice(0, count))
      })
      
      // Fill remaining slots with random questions (excluding already selected)
      const remainingSlots = Math.max(0, questionCount - selectedQuestions.length)
      if (remainingSlots > 0) {
        const selectedIds = new Set(selectedQuestions.map(q => q.id))
        const remainingQuestions = questionBank.questions
          .filter(q => !selectedIds.has(q.id))
          .sort(() => Math.random() - 0.5)
        selectedQuestions.push(...remainingQuestions.slice(0, remainingSlots))
      }
      
      // Shuffle final selection
      selectedQuestions.sort(() => Math.random() - 0.5)
      
      setQuestions(selectedQuestions)
      setQuizStarted(true)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } catch (error) {
      console.error('Failed to load questions:', error)
      setLoadingError('加载题目失败，请检查网络连接后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null && questionQueue[currentQuestionIndex]) {
      answerQuestion(questionQueue[currentQuestionIndex].id, selectedAnswer)
      setShowFeedback(true)
    }
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
    nextQuestion()
  }

  const handleViewResults = () => {
    // Calculate dimension scores
    const scores = calculateDimensionScores(answers, questionQueue)
    const overall = getOverallScore(scores)
    const summary = generateSummary(scores)
    
    // Save to profile store
    setDimensionScores(scores)
    setProfile({
      summary,
      createdAt: Date.now()
    })
    
    // Save to history
    addRecord({
      id: `quiz_${Date.now()}`,
      date: Date.now(),
      questionCount: questionQueue.length,
      dimensionScores: scores,
      overallScore: overall,
      summary
    })
    
    // Navigate to profile page
    navigate('/profile')
  }

  const handleRestart = () => {
    resetQuiz()
    setQuizStarted(false)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  const handleRetry = () => {
    setLoadingError(null)
    handleStartQuiz()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="quiz quiz-loading">
        <div className="loading-card">
          <div className="loading-spinner">⟳</div>
          <h2>正在加载题目...</h2>
          <p>正在从服务器获取最新题库</p>
        </div>
      </div>
    )
  }

  // Error state
  if (loadingError) {
    return (
      <div className="quiz quiz-error">
        <div className="error-card">
          <h2>加载失败</h2>
          <p>{loadingError}</p>
          <div className="error-actions">
            <button className="btn btn-outline" onClick={handleRestart}>
              返回
            </button>
            <button className="btn btn-primary" onClick={handleRetry}>
              重试
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Start screen
  if (!quizStarted && !isCompleted) {
    return (
      <div className="quiz quiz-start">
        <div className="start-card">
          <h1>Mirror·镜 认知测评</h1>
          <p className="intro">
            本测评包含 <strong>7种题型</strong>，涵盖7个认知维度。
            通过测评，您将获得详细的认知画像和个性化改进建议。
          </p>
          <div className="quiz-info">
            <div className="info-item">
              <span className="info-icon">📝</span>
              <span>{questionCount}道题目</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <span>约10-15分钟</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <span>7个维度</span>
            </div>
          </div>
          <button className="btn btn-primary btn-large" onClick={handleStartQuiz}>
            开始测评
          </button>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    const scores = calculateDimensionScores(answers, questionQueue)
    const overall = getOverallScore(scores)
    
    return (
      <div className="quiz quiz-completed">
        <div className="completed-card">
          <h1>🎉 测评完成！</h1>
          <p>您已完成 {questionQueue.length} 道题目</p>
          
          <div className="result-preview">
            <div className="overall-score">
              <span className="score-label">综合得分</span>
              <span className="score-value">{overall}</span>
            </div>
            <div className="score-breakdown">
              {scores.slice(0, 3).map(s => (
                <div key={s.dimension} className="score-mini">
                  <span>{s.dimension}</span>
                  <span>{s.score}</span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="hint">点击下方按钮查看完整画像报告</p>
          <div className="completed-actions">
            <button className="btn btn-secondary" onClick={handleRestart}>
              重新测评
            </button>
            <button className="btn btn-primary" onClick={handleViewResults}>
              查看画像 →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questionQueue.length === 0) {
    return <div className="quiz">加载中...</div>
  }

  const currentQuestion = questionQueue[currentQuestionIndex]
  const totalQuestions = questionQueue.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="progress-info">
          <span>题目 {currentQuestionIndex + 1} / {totalQuestions}</span>
          <div className="meta-tags">
            <span className="type-tag">{currentQuestion.category}</span>
            <span className="dimension-tag">{currentQuestion.dimension}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="question-card">
        {currentQuestion.scenario && (
          <div className="scenario-box">
            <p>{currentQuestion.scenario}</p>
          </div>
        )}
        
        <div className="question-type-badge">{currentQuestion.category}</div>
        <h2 className="question-text">{currentQuestion.text}</h2>
        
        {currentQuestion.extension && (
          <p className="extension-text">💭 {currentQuestion.extension}</p>
        )}
        
        <div className="options">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const showCorrect = showFeedback && option.score >= 4
            
            return (
              <button
                key={index}
                className={`option ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''}`}
                onClick={() => !showFeedback && setSelectedAnswer(index)}
                disabled={showFeedback}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option.text}</span>
                {option.explanation && showFeedback && (
                  <span className="option-explanation">{option.explanation}</span>
                )}
              </button>
            )
          })}
        </div>

        {showFeedback && currentQuestion.options[selectedAnswer!] && (
          <div className="feedback">
            <p>本题得分：{currentQuestion.options[selectedAnswer!].score} / 5</p>
            {currentQuestion.options[selectedAnswer!].explanation && (
              <p className="explanation">{currentQuestion.options[selectedAnswer!].explanation}</p>
            )}
          </div>
        )}
      </div>

      <div className="quiz-actions">
        {!showFeedback ? (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
          >
            提交答案
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQuestionIndex < totalQuestions - 1 ? '下一题 →' : '查看结果'}
          </button>
        )}
      </div>
    </div>
  )
}
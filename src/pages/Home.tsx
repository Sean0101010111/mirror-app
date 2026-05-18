import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { useProfileStore } from '../stores/profileStore'
import { useQuizHistory } from '../stores/quizStore'
import { getOverallScore, getWeaknesses, sampleProfile, sampleSummary } from '../services/profiling'
import './Home.css'

export default function Home() {
  const { dimensionScores, summary, profileHistory } = useProfileStore()
  const { history } = useQuizHistory()
  const [showSample, setShowSample] = useState(false)
  
  const displayData = showSample ? sampleProfile : dimensionScores
  const displaySummary = showSample ? sampleSummary : summary
  
  const hasData = dimensionScores.length > 0
  const overallScore = hasData || showSample ? getOverallScore(displayData) : 0
  
  // Get top 3 dimensions and top weakness
  const sortedByScore = [...displayData].sort((a, b) => b.score - a.score)
  const top3 = sortedByScore.slice(0, 3)
  const mainWeakness = getWeaknesses(displayData)[0]
  
  // Get comparison with previous profile snapshot
  const previousSnapshot = profileHistory.length > 0 ? profileHistory[profileHistory.length - 1] : null
  
  const handleToggleSample = () => {
    setShowSample(!showSample)
  }
  
  // Calculate dimension changes if there's a previous snapshot
  const getDimensionChange = (dimension: string, currentScore: number): number | null => {
    if (!previousSnapshot) return null
    const prev = previousSnapshot.dimensionScores.find(d => d.dimension === dimension)
    if (!prev) return null
    return currentScore - prev.score
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>欢迎使用 <span className="brand">Mirror</span>·镜</h1>
        <p className="tagline">发现你思维里的定时炸弹</p>
      </header>

      <section className="hero-section">
        <div className="radar-showcase">
          {hasData || showSample ? (
            <>
              <div className="overall-badge">
                <span className="badge-label">综合得分</span>
                <span className="badge-value">{overallScore}</span>
              </div>
              
              <div className="radar-wrapper">
                <ResponsiveContainer width="100%" height={380}>
                  <RadarChart data={displayData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    />
                    <Radar 
                      name="能力"
                      dataKey="score" 
                      stroke="url(#radarGradient)"
                      fill="url(#radarGradient)"
                      fillOpacity={0.4}
                    />
                    <defs>
                      <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="empty-hero">
              <div className="empty-icon">🔍</div>
              <h2>你的认知盲区在哪里？</h2>
              <p>14道题，5分钟，发现影响你决策的思维盲区</p>
              <button className="btn btn-sample" onClick={handleToggleSample}>
                查看示例画像
              </button>
            </div>
          )}
        </div>
        
        {showSample && !hasData && (
          <div className="sample-notice">
            <span>这是示例画像</span>
            <button onClick={handleToggleSample}>开始真实测评 →</button>
          </div>
        )}
      </section>

      {hasData && !showSample && (
        <>
          <section className="top-dimensions">
            <h2>你最强的三个维度</h2>
            <div className="top-list">
              {top3.map((item, index) => {
                const change = getDimensionChange(item.dimension, item.score)
                return (
                  <div key={item.dimension} className="top-item fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <span className="rank">#{index + 1}</span>
                    <span className="name">{item.dimension}</span>
                    <span className="score">{item.score}</span>
                    {change !== null && (
                      <span className={`change ${change > 0 ? 'up' : change < 0 ? 'down' : ''}`}>
                        {change > 0 ? `+${change}` : change}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {mainWeakness && (
            <section className="focus-area">
              <h2>最需关注</h2>
              <div className="focus-card">
                <div className="focus-header">
                  <span className="focus-dimension">{mainWeakness.dimension}</span>
                  <span className="focus-score">{mainWeakness.score}</span>
                </div>
                <p className="focus-hint">这个维度可能在关键时刻影响你的判断</p>
                <Link to="/weakness" className="btn btn-outline">查看详情</Link>
              </div>
            </section>
          )}

          {previousSnapshot && (
            <section className="comparison-section">
              <h2>与上次对比</h2>
              <div className="comparison-list">
                {dimensionScores.map((item) => {
                  const change = getDimensionChange(item.dimension, item.score)
                  if (change === null || change === 0) return null
                  return (
                    <div key={item.dimension} className={`comparison-item ${change > 0 ? 'improved' : 'declined'}`}>
                      <span className="comp-dimension">{item.dimension}</span>
                      <span className="comp-change">
                        {change > 0 ? '↑' : '↓'} {Math.abs(change)}分
                      </span>
                    </div>
                  )
                })}
                {dimensionScores.every(d => getDimensionChange(d.dimension, d.score) === null || getDimensionChange(d.dimension, d.score) === 0) && (
                  <p className="comparison-hint">继续坚持，看看下次有什么变化</p>
                )}
              </div>
            </section>
          )}

          {displaySummary && (
            <section className="summary-section">
              <p>{displaySummary}</p>
            </section>
          )}

          <section className="action-section">
            <Link to="/quiz" className="btn btn-primary">
              {history.length > 0 ? '再次测评' : '开始测评'}
            </Link>
            <Link to="/profile" className="btn btn-outline">查看完整画像</Link>
          </section>
        </>
      )}

      <section className="history-section">
        <h2>测评历史</h2>
        {history.length > 0 ? (
          <div className="history-list">
            {history.slice(0, 5).map((record) => (
              <div key={record.id} className="history-item">
                <div className="history-date">
                  {new Date(record.date).toLocaleDateString('zh-CN')}
                </div>
                <div className="history-score">
                  <span className="score">{record.overallScore}</span>
                  <span className="label">分</span>
                </div>
                <div className="history-meta">
                  {record.questionCount}题
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-history">
            <p>还没有测评记录</p>
            <p className="hint">完成测评后将自动保存您的历史记录</p>
          </div>
        )}
      </section>
    </div>
  )
}
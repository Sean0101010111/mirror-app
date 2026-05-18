import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { useProfileStore } from '../stores/profileStore'
import { getOverallScore, dimensionDescriptions, generateCounterIntuitiveInsights } from '../services/profiling'
import type { Dimension, DimensionScore } from '../lib/types'
import './Profile.css'

function DimensionCard({ item }: { item: DimensionScore }) {
  const [expanded, setExpanded] = useState(false)
  const desc = dimensionDescriptions[item.dimension as Dimension]
  
  let description = '暂无详细描述'
  if (desc) {
    if (item.score >= 75) description = desc.high
    else if (item.score >= 60) description = desc.medium
    else description = desc.low
  }
  
  const insights = generateCounterIntuitiveInsights([item])
  const insight = insights[item.dimension]
  
  return (
    <div className={`dimension-card ${expanded ? 'expanded' : ''}`}>
      <button className="dimension-header" onClick={() => setExpanded(!expanded)}>
        <div className="header-left">
          <h3>{item.dimension}</h3>
          <span className={`score-badge ${item.score >= 75 ? 'high' : item.score < 60 ? 'low' : 'medium'}`}>
            {item.score}
          </span>
        </div>
        <div className="header-right">
          <span className={`confidence-tag ${item.confidence >= 80 ? 'high' : item.confidence >= 60 ? 'medium' : 'low'}`}>
            {item.confidence}%
          </span>
          <span className={`expand-icon ${expanded ? 'rotated' : ''}`}>›</span>
        </div>
      </button>
      
      {expanded && (
        <div className="dimension-content">
          <div className="score-bar-large">
            <div 
              className={`score-fill ${item.score >= 75 ? 'high' : item.score < 60 ? 'low' : ''}`}
              style={{ width: `${item.score}%` }}
            />
          </div>
          
          <p className="dimension-desc">{description}</p>
          
          {insight && (
            <div className="insight-box">
              <span className="insight-label">💡 反直觉洞察</span>
              <p className="insight-text">{insight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Profile() {
  const { dimensionScores, summary } = useProfileStore()
  
  if (dimensionScores.length === 0) {
    return (
      <div className="profile">
        <header className="profile-header">
          <h1>认知画像详情</h1>
          <p className="subtitle">基于您的测评结果生成的综合报告</p>
        </header>
        <div className="empty-state">
          <p>暂无画像数据</p>
          <p className="hint">请先完成测评以生成您的认知画像</p>
        </div>
      </div>
    )
  }

  const overallScore = getOverallScore(dimensionScores)

  return (
    <div className="profile">
      <header className="profile-header">
        <h1>认知画像详情</h1>
        <p className="subtitle">基于您的测评结果生成的综合报告</p>
      </header>

      <section className="hero-radar">
        <div className="radar-container">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={dimensionScores}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
              />
              <Radar 
                name="能力得分" 
                dataKey="score" 
                stroke="url(#profileRadarGradient)"
                fill="url(#profileRadarGradient)"
                fillOpacity={0.5}
              />
              <defs>
                <linearGradient id="profileRadarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="overall-badge">
          <span className="badge-label">综合得分</span>
          <span className="badge-value">{overallScore}</span>
        </div>
      </section>

      {summary && (
        <section className="summary-section">
          <p>{summary}</p>
        </section>
      )}

      <section className="dimensions-section">
        <h2>各维度详解 <span className="hint">点击展开查看反直觉洞察</span></h2>
        <div className="dimensions-list">
          {dimensionScores.map((item) => (
            <DimensionCard key={item.dimension} item={item} />
          ))}
        </div>
      </section>
    </div>
  )
}
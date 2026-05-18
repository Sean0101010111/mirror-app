import { useProfileStore } from '../stores/profileStore'
import { getWeaknesses, weaknessSuggestions, dimensionDescriptions } from '../services/profiling'
import { Link } from 'react-router-dom'
import type { Dimension } from '../lib/types'
import './Weakness.css'

export default function Weakness() {
  const { dimensionScores } = useProfileStore()
  
  const weaknesses = dimensionScores.length > 0 ? getWeaknesses(dimensionScores) : []

  return (
    <div className="weakness">
      <header className="weakness-header">
        <h1>弱点报告</h1>
        <p className="subtitle">识别认知盲区，专注最重要的一步</p>
      </header>

      {dimensionScores.length === 0 ? (
        <div className="empty-state">
          <p>暂无弱点数据</p>
          <p className="hint">请先完成测评以生成您的弱点报告</p>
        </div>
      ) : weaknesses.length === 0 ? (
        <div className="empty-state success">
          <p>🎉 表现优异</p>
          <p className="hint">您在所有维度都表现良好，没有明显弱点</p>
        </div>
      ) : (
        <section className="weakness-list">
          {weaknesses.map((weakness) => {
            const suggestions = weaknessSuggestions[weakness.dimension as Dimension] || []
            const desc = dimensionDescriptions[weakness.dimension as Dimension]
            
            return (
              <div key={weakness.dimension} className="weakness-card">
                <div className="weakness-header-row">
                  <div className="weakness-info">
                    <span className={`priority-tag ${weakness.score < 60 ? 'primary' : 'secondary'}`}>
                      {weakness.score < 60 ? '重点关注' : '可优化'}
                    </span>
                    <h2>{weakness.dimension}</h2>
                  </div>
                  <div className="weakness-score">
                    <span className="score-value">{weakness.score}</span>
                  </div>
                </div>

                {desc && (
                  <p className="weakness-desc">{desc.low}</p>
                )}

                <div className="suggestions">
                  <h3>如何改善</h3>
                  <ul>
                    {suggestions.slice(0, 2).map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>

                <div className="weakness-actions">
                  <button className="btn btn-success">我已改进这项 ✓</button>
                  <Link to="/quiz" className="btn btn-outline">下次再测</Link>
                </div>
              </div>
            )
          })}
        </section>
      )}

      <section className="summary-section">
        <h2>改进进度</h2>
        <div className="summary-stats">
          <div className="stat-card">
            <span className="stat-value">{weaknesses.length}</span>
            <span className="stat-label">待改进</span>
          </div>
          <div className="stat-card highlight">
            <span className="stat-value">0</span>
            <span className="stat-label">已达成</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{weaknesses.length}</span>
            <span className="stat-label">进行中</span>
          </div>
        </div>
      </section>
    </div>
  )
}
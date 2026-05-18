import { useState, useEffect } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { 
  getApiUrl, 
  setApiUrl, 
  getVersionInfo, 
  checkForUpdates,
  downloadUpdate,
  isAutoSyncEnabled,
  setAutoSync,
  type QuestionBank,
} from '../services/questionSync'
import './Settings.css'

export default function Settings() {
  const { 
    theme, 
    questionCount, 
    showFeedback,
    setTheme, 
    setQuestionCount, 
    setShowFeedback 
  } = useSettingsStore()

  // Question bank sync state
  const [apiUrl, setApiUrlState] = useState(getApiUrl())
  const [versionInfo, setVersionInfo] = useState(getVersionInfo())
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'downloading' | 'error'>('idle')
  const [autoSync, setAutoSyncState] = useState(isAutoSyncEnabled())
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Update version info periodically
  useEffect(() => {
    setVersionInfo(getVersionInfo())
  }, [])

  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrlState(e.target.value)
  }

  const handleSaveApiUrl = () => {
    setApiUrl(apiUrl)
    setErrorMessage(null)
  }

  const handleCheckUpdate = async () => {
    setUpdateStatus('checking')
    setErrorMessage(null)
    
    try {
      const result = await checkForUpdates()
      if (result.hasUpdate) {
        setUpdateStatus('available')
      } else {
        setUpdateStatus('idle')
      }
      setVersionInfo(getVersionInfo())
    } catch (e) {
      setUpdateStatus('error')
      setErrorMessage('检查更新失败，请检查网络连接')
    }
  }

  const handleDownloadUpdate = async () => {
    setUpdateStatus('downloading')
    setErrorMessage(null)
    
    try {
      const newBank: QuestionBank = await downloadUpdate()
      setVersionInfo({
        version: newBank.meta.version,
        lastUpdated: newBank.meta.lastUpdated,
        source: 'cache',
        lastAutoCheck: new Date().toISOString(),
      })
      setUpdateStatus('idle')
    } catch (e) {
      setUpdateStatus('error')
      setErrorMessage('下载更新失败，请稍后重试')
    }
  }

  const handleAutoSyncChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked
    setAutoSyncState(enabled)
    setAutoSync(enabled)
  }

  const handleExport = () => {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      settings: { theme, questionCount, showFeedback },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mirror-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="settings">
      <header className="settings-header">
        <h1>设置</h1>
        <p className="subtitle">自定义您的测评体验</p>
      </header>

      <section className="settings-section">
        <h2>外观</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">主题</span>
            <span className="setting-desc">选择应用的外观风格</span>
          </div>
          <div className="theme-selector">
            <button 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <span className="theme-icon">☀️</span>
              浅色
            </button>
            <button 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <span className="theme-icon">🌙</span>
              深色
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>测评</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">题目数量</span>
            <span className="setting-desc">每次测评的题目数量</span>
          </div>
          <select 
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="setting-select"
          >
            <option value={5}>5 题</option>
            <option value={10}>10 题</option>
            <option value={15}>15 题</option>
            <option value={20}>20 题</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">即时反馈</span>
            <span className="setting-desc">答题后立即显示得分和解析</span>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={showFeedback}
              onChange={(e) => setShowFeedback(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h2>题库更新</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">题库版本</span>
            <span className="setting-desc">
              当前版本: {versionInfo.version} 
              <span className="source-badge">{versionInfo.source === 'api' ? '来自服务器' : versionInfo.source === 'cache' ? '本地缓存' : '内置'}</span>
            </span>
            {versionInfo.lastAutoCheck && (
              <span className="setting-desc" style={{ marginTop: '0.25rem' }}>
                上次检查: {new Date(versionInfo.lastAutoCheck).toLocaleString('zh-CN')}
              </span>
            )}
          </div>
          <button 
            className="btn btn-outline" 
            onClick={handleCheckUpdate}
            disabled={updateStatus === 'checking' || updateStatus === 'downloading'}
          >
            {updateStatus === 'checking' ? '检查中...' : '检查更新'}
          </button>
        </div>

        {updateStatus === 'available' && (
          <div className="update-banner">
            <div className="update-info">
              <span className="update-label">发现新版本</span>
              <span className="update-desc">有新题库可供更新</span>
            </div>
            <button className="btn btn-primary" onClick={handleDownloadUpdate}>
              更新
            </button>
          </div>
        )}

        {updateStatus === 'downloading' && (
          <div className="update-banner downloading">
            <span>正在下载新题库...</span>
          </div>
        )}

        {errorMessage && (
          <div className="error-banner">
            {errorMessage}
          </div>
        )}

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">题库 API 地址</span>
            <span className="setting-desc">配置题库服务器地址</span>
          </div>
        </div>
        <div className="api-input-group">
          <input
            type="url"
            value={apiUrl}
            onChange={handleApiUrlChange}
            placeholder="https://api.example.com"
            className="api-input"
          />
          <button className="btn btn-outline" onClick={handleSaveApiUrl}>
            保存
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">自动检查更新</span>
            <span className="setting-desc">启动时自动检查题库更新</span>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={autoSync}
              onChange={handleAutoSyncChange}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h2>数据</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">导出设置</span>
            <span className="setting-desc">将您的设置导出为 JSON 文件</span>
          </div>
          <button className="btn btn-outline" onClick={handleExport}>
            导出
          </button>
        </div>

        <div className="setting-item danger">
          <div className="setting-info">
            <span className="setting-label">清除所有数据</span>
            <span className="setting-desc">删除所有测评记录和画像数据</span>
          </div>
          <button className="btn btn-danger" onClick={handleClearData}>
            清除
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>关于</h2>
        <div className="about-info">
          <div className="about-item">
            <span className="about-label">版本</span>
            <span className="about-value">0.1.0</span>
          </div>
          <div className="about-item">
            <span className="about-label">构建</span>
            <span className="about-value">React 19 + TypeScript + Vite</span>
          </div>
          <p className="about-desc">
            Mirror·镜 — 个人深度蒸馏系统，帮助您识别认知盲区，实现真正的认知提升。
          </p>
        </div>
      </section>
    </div>
  )
}
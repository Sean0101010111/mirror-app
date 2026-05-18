import { useEffect, useState } from 'react'
import Router from './router'
import { autoUpdateOnLogin } from './services/questionSync'
import './styles/index.css'

function App() {
  const [updateStatus, setUpdateStatus] = useState<{
    checking: boolean
    updated: boolean
    version: string | null
  }>({ checking: true, updated: false, version: null })

  useEffect(() => {
    // Auto-update question bank on app startup
    let mounted = true

    async function checkAndUpdate() {
      try {
        const result = await autoUpdateOnLogin()
        if (mounted) {
          setUpdateStatus({
            checking: false,
            updated: result.updated,
            version: result.newVersion,
          })
        }
      } catch (e) {
        if (mounted) {
          setUpdateStatus({ checking: false, updated: false, version: null })
        }
      }
    }

    checkAndUpdate()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      {/* Silent update indicator - shows briefly if update occurred */}
      {updateStatus.updated && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            background: '#10B981',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            zIndex: 9999,
            opacity: 0.9,
          }}
        >
          题库已更新到 v{updateStatus.version}
        </div>
      )}
      <Router />
    </>
  )
}

export default App
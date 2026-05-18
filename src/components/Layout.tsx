import { Outlet, Link } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/"><span>Mirror</span>·镜</Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">首页</Link>
          <Link to="/quiz" className="nav-link">测评</Link>
          <Link to="/profile" className="nav-link">画像</Link>
          <Link to="/weakness" className="nav-link">弱点</Link>
          <Link to="/settings" className="nav-link">设置</Link>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
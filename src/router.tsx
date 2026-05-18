import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Profile from './pages/Profile'
import Weakness from './pages/Weakness'
import Settings from './pages/Settings'
import Layout from './components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'quiz', element: <Quiz /> },
      { path: 'profile', element: <Profile /> },
      { path: 'weakness', element: <Weakness /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
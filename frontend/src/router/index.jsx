import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import LandingPage from '../components/LandingPage/LandingPage'
import Dashboard from '../components/Dashboard/dashboard'
import Navigation from '../components/Navigation/Navigation'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      }
    ],
  }
])

import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import LandingPage from '../components/LandingPage/LandingPage'
import Dashboard from '../components/Dashboard/dashboard'

export const router = createBrowserRouter([
      // {
      //   path: '/',
      //   element: <h1>Home Page</h1>,
      // },
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      }
    ])

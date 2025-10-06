import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import LandingPage from '../components/LandingPage/LandingPage'

export const router = createBrowserRouter([
      // {
      //   path: '/',
      //   element: <h1>Home Page</h1>,
      // },
      {
        path: '/',
        element: <LandingPage />,
      },
    ])

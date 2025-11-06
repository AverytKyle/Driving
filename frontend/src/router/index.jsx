import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import LandingPage from '../components/LandingPage/LandingPage'
import Dashboard from '../components/Dashboard/dashboard'
import ManageRoutes from '../components/Routes/ManageRoutes'
import MapPage from '../components/Map/MapWrapper'

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
      },
      {
        path: '/my-routes',
        element: <ManageRoutes />,
      },
      {
        path: '/map',
        element: <MapPage />,
      },
    ],
  }
])

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouteProvider } from 'react-router-dom'
import configureStore from './redux/store'
import { router } from './router'
import './index.css'
import App from './App.jsx'

const store = configureStore()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouteProvider router={router}/>
    </Provider>
  </StrictMode>,
)

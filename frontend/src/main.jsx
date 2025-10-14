import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import configureStore from './redux/store'
import { router } from './router'
import './index.css'
import { authenticate } from './redux/session'

const store = configureStore()

// Wait for session restoration before first render
;(async () => {
  try {
    await store.dispatch(authenticate())
  } catch (err) {
    // ignore - app can continue if restore fails
    console.warn('session restore failed', err)
  }

  // Now render the app
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>
  )
})()

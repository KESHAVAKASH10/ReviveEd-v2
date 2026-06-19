import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#111520',
            color: '#e8ecf4',
            border: '1px solid #1e2840',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontFamily: 'Sora, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#00e5a0',
              secondary: '#111520',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4a6e',
              secondary: '#111520',
            },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>
)
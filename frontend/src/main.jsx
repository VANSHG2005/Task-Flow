import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2a2520',
            color: '#e8e4dc',
            border: '1px solid #504942',
            fontFamily: 'Syne, sans-serif',
            fontSize: '14px'
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#2a2520' }
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#2a2520' }
          }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)

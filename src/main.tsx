import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { AppProvider } from './context.tsx'
import { AuthProvider } from './AuthContext.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AuthProvider>
    <AppProvider>
    <App />
    </AppProvider>
    </AuthProvider>
  </BrowserRouter>
)

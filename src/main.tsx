import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter as Router} from 'react-router-dom'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from './context/AuthContext.tsx'
const client = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client} >
  <Router>
    <AuthProvider>
    <App />
    </AuthProvider>
  </Router>
    </QueryClientProvider>
  </StrictMode>
)

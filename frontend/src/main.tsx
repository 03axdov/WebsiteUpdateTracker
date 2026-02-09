import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import '../static/css/index.css'
import '../static/css/root.css'
import '../static/css/dashboard.css'
import '../static/css/notification.css'
import App from './pages/App.tsx'
import { AuthProvider } from './contexts/auth.tsx';
import { NotificationProvider } from './components/NotificationProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)

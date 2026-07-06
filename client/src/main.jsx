import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster }    from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color:      '#f9fafb',
          fontSize:   '14px',
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
      }}
    />
    <App />
  </StrictMode>
);
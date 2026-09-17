import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FinanceProvider } from './context/FinanceContext';

// Import All Stylesheets
import './styles/design-tokens.css';
import './styles/main.css';
import './styles/navigation.css';
import './styles/modals.css';
import './styles/scanner.css';
import './styles/tanya-ai.css';
import './styles/dashboard.css';
import './styles/pages.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FinanceProvider>
      <App />
    </FinanceProvider>
  </React.StrictMode>
);

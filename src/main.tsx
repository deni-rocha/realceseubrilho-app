import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js',
        {
          scope: '/',
          type: 'module',
        },
      );

      console.log('Service Worker registrado com sucesso:', registration);
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }
};

// Registra ANTES de renderizar o React
registerServiceWorker().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in OLDBIJOU app:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#08090E',
          color: '#F59E0B',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '12px' }}>
            OLDBIJOU Hub
          </h1>
          <p style={{ color: '#d1d5db', marginBottom: '20px', maxWidth: '400px' }}>
            حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#F59E0B',
              color: '#000',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            إعادة التحميل / Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

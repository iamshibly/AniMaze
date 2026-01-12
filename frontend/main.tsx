// src/main.tsx - Enhanced with better error handling
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  console.error('Application Error:', error);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <div className="mb-4">
          <div className="text-red-500 text-5xl mb-2">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Application Error</h2>
          <p className="text-gray-600 text-sm mb-4">
            Something went wrong while loading the application.
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded mb-4 text-left">
          <p className="text-xs text-gray-700 font-mono">
            {error.message}
          </p>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={resetErrorBoundary}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}

// Check for root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  // Create fallback if root element is missing
  document.body.innerHTML = `
    <div style="
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-family: system-ui, -apple-system, sans-serif;
      background: #f3f4f6;
      color: #1f2937;
    ">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">
          🚨 Root Element Missing
        </h1>
        <p style="margin-bottom: 1rem;">
          The root element was not found in the HTML document.
        </p>
        <p style="font-size: 0.875rem; color: #6b7280;">
          Please check if index.html contains &lt;div id="root">&lt;/div>
        </p>
      </div>
    </div>
  `;
  console.error('❌ Root element not found! Check index.html for <div id="root"></div>');
} else {
  // Enhanced error reporting
  window.addEventListener('error', (event) => {
    console.error('🚨 Global Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', {
      reason: event.reason,
      promise: event.promise
    });
  });

  try {
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          onError={(error, errorInfo) => {
            console.error('🚨 React Error Boundary:', {
              error: error.message,
              stack: error.stack,
              errorInfo
            });
          }}
        >
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    console.log('✅ Application rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render application:', error);
    
    // Fallback rendering
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-family: system-ui, -apple-system, sans-serif;
        background: #fef2f2;
        color: #991b1b;
      ">
        <div style="text-align: center; padding: 2rem; max-width: 500px;">
          <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">
            ⚠️ Render Error
          </h1>
          <p style="margin-bottom: 1rem;">
            Failed to render the React application.
          </p>
          <pre style="
            background: #fee2e2; 
            padding: 1rem; 
            border-radius: 0.5rem; 
            font-size: 0.75rem;
            text-align: left;
            overflow: auto;
            margin-bottom: 1rem;
          ">${error instanceof Error ? error.message : String(error)}</pre>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #dc2626; 
              color: white; 
              padding: 0.5rem 1rem; 
              border: none; 
              border-radius: 0.375rem; 
              cursor: pointer;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
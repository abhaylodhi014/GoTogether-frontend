import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './utils/ErrorBoundary';
//ErrorBoundary is a component that catches runtime errors in the component tree and prevents the app from crashing.
// Use createRoot for React 18+ rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ErrorBoundary from './utils/ErrorBoundary'; // Import the Error Boundary

// React.StrictMode is removed for production build to avoid performance impact
ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);

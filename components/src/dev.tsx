import React from 'react';
import { createRoot } from 'react-dom/client';
import { PensionWithdrawalFlow } from './components/PensionWithdrawalFlow';
import { createTheme } from '@mui/material/styles';

const App = () => {
  const handleComplete = (result: any) => {
    console.log('Submission completed:', result);
  };

  const handleError = (error: any) => {
    console.error('Error occurred:', error);
  };

  const handleStateChange = (state: any) => {
    console.log('State changed:', state);
  };

  // Create complete theme configuration using createTheme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff'
      }
    }
  });

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <PensionWithdrawalFlow
        config={{
          apiBase: 'http://localhost:3000/api',
          totalPension: 100000,
          theme: theme
        }}
        onComplete={handleComplete}
        onError={handleError}
        onStateChange={handleStateChange}
      />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} 
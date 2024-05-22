import React from 'react';
import { FormDataProvider } from './components/FormDataContext'; // Import FormDataProvider
import AppContent from './AppContent';

const App = () => {
  return (
    <FormDataProvider> {/* Wrap App component with FormDataProvider */}
      <AppContent />
    </FormDataProvider>
  );
};

export default App;
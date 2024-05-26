import React from 'react';
import { FormDataProvider } from './components/FormDataContext'; // Import FormDataProvider
import AppContent from './AppContent';

const App = () => {
  return (
    <FormDataProvider>
      <AppContent />
    </FormDataProvider>
  );
};

export default App;
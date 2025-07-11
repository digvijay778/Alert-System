// frontend/src/App.jsx

import React from 'react';
import AppRoutes from './routes';
import Layout from './components/Layout'; // Import the Layout component

const App = () => {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export default App;

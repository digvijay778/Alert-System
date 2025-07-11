// frontend/src/components/Layout.jsx

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 
        This is the ideal place to add a persistent navigation bar or footer
        if the application required one. For our current design, it simply
        ensures a consistent background and renders the page content.
      */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;

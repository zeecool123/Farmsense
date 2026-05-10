import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, userEmail }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Navbar userEmail={userEmail} />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

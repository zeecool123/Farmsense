import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { AutomationProvider } from '../context/AutomationContext';
import { ResourceProvider } from '../context/ResourceContext';


const Layout = ({ children, userEmail }) => {
  return (
    <ResourceProvider>
      <AutomationProvider>
        <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col overflow-hidden">
            <Navbar userEmail={userEmail} />
            <main className="flex-1 overflow-auto bg-transparent">
              <div className="w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </AutomationProvider>
    </ResourceProvider>
  );
};

export default Layout;
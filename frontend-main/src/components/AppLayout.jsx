import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen selection:bg-primary/30 flex">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex-1 min-w-0 flex flex-col md:ml-20 lg:ml-64">
        <Navbar setMobileMenuOpen={setMobileMenuOpen} />
        <main className="flex-1 min-w-0 bg-background relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

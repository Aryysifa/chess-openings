import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Openings Explorer' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Listen for menu toggle events from header
  useEffect(() => {
    const handleToggleMenu = () => {
      console.log('Toggle event received!');
      toggleSidebar();
    };

    window.addEventListener('toggleMenu', handleToggleMenu);
    return () => window.removeEventListener('toggleMenu', handleToggleMenu);
  }, []);

  return (
    <>
      {/* Overlay - only covers area below header */}
      {isOpen && (
        <div
          className="fixed bg-black bg-opacity-50 z-30"
          style={{ top: '80px', left: 0, right: 0, bottom: 0 }}
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar - positioned below header */}
      <div
        className={`fixed left-0 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ top: '80px', height: 'calc(100vh - 80px)', overflow: 'hidden' }}
      >
        <div className="p-6">
          <nav className="space-y-4">
            {isOpen && menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`block px-4 py-3 text-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-white font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
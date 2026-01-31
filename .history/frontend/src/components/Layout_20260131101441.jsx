import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { 
  FaHome, 
  FaTasks, 
  FaChartBar,
  FaBars,
  FaTimes,
  FaPlus,
  FaUser
} from 'react-icons/fa';
import { useState } from 'react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: FaHome },
    { name: 'All Tasks', path: '/dashboard?filter=all', icon: FaTasks },
    { name: 'Create Task', path: '/dashboard?create=true', icon: FaPlus },
    { name: 'Analytics', path: '/analytics', icon: FaChartBar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
    
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 mr-2"
            >
              {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          </div>
          <Link to="/dashboard" className="p-2 text-gray-600 hover:text-gray-900">
            <FaUser size={18} />
          </Link>
        </div>
        
        {sidebarOpen && (
          <div className="bg-white border-b">
            <nav className="px-4 py-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="flex">
    
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:border-l-4 hover:border-gray-300'
                    }`}
                  >
                    <item.icon className="mr-3" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="px-4 py-4 border-t mt-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

   
        <div className="flex-1 lg:pl-64">
          <main className="py-6">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
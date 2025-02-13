import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, toggleTheme } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronLeft, 
  LogOut,
  LayoutDashboard,
  Trello,
  KanbanSquare,
  User,
} from 'lucide-react';

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarOpen, theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/scrum', label: 'Scrum Board', icon: Trello },
    { path: '/kanban', label: 'Kanban Board', icon: KanbanSquare },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500`}>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-72 transform 
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                      transition-all duration-500 ease-in-out`}>
        <div className="h-full bg-white dark:bg-gray-800 shadow-xl border-r 
                      border-gray-200 dark:border-gray-700">
          {/* Sidebar Header */}
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-mono">
                Project Manager
              </h2>
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                        transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 mt-6">
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => navigate(item.path)}
                    className="relative w-full p-4 flex items-center rounded-lg
                            hover:bg-gray-100 dark:hover:bg-gray-700
                            transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 mr-4 text-gray-600 dark:text-gray-400 
                                 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium 
                                 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-500 ease-in-out
                    ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 
                        border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {!sidebarOpen && (
                <button
                  onClick={() => dispatch(toggleSidebar())}
                  className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                          transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              )}

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                          transition-colors"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg
                          hover:bg-gray-100 dark:hover:bg-gray-700 
                          transition-colors group"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {user?.name || 'User'}
                  </span>
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400
                                group-hover:text-red-500 dark:group-hover:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg
                        border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
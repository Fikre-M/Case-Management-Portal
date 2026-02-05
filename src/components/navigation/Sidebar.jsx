// import { Link, useLocation } from 'react-router-dom'

// function Sidebar({ isOpen, onClose }) {
//   const location = useLocation()

//   const menuItems = [
//     { path: '/dashboard', label: 'Dashboard', icon: '📊' },
//     { path: '/appointments', label: 'Appointments', icon: '📅' },
//     { path: '/cases', label: 'Cases', icon: '📋' },
//     { path: '/clients', label: 'Clients', icon: '👥' },
//     { path: '/calendar', label: 'Calendar', icon: '🗓️' },
//     { path: '/ai-assistant', label: 'AI Assistant', icon: '🤖' },
//     { path: '/reports', label: 'Reports', icon: '📈' },
//     { path: '/showcase', label: 'Tech Showcase', icon: '🚀' },
//     { path: '/settings', label: 'Settings', icon: '⚙️' },
//   ]

//   const isActive = (path) => location.pathname === path

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-colors">
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//           <Link to="/dashboard" className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
//               <span className="text-2xl">🤖</span>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 dark:text-white">
//                 AI CaseManager
//               </h1>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Smart Management
//               </p>
//             </div>
//           </Link>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto py-4">
//           <div className="px-3 space-y-1">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
//                   isActive(item.path)
//                     ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 <span className="text-xl mr-3">{item.icon}</span>
//                 <span>{item.label}</span>
//                 {isActive(item.path) && (
//                   <span className="ml-auto w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
//                 )}
//               </Link>
//             ))}
//           </div>
//         </nav>

//         {/* User Profile Section */}
//         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//           <Link
//             to="/profile"
//             className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
//               FM
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                 Fikre Mariam
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                 fikre@example.com
//               </p>
//             </div>
//           </Link>
//         </div>
//       </aside>

//       {/* Mobile Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//           <Link
//             to="/dashboard"
//             className="flex items-center space-x-3"
//             onClick={onClose}
//           >
//             <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
//               <span className="text-2xl">🤖</span>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 dark:text-white">
//                 AI CaseManager
//               </h1>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Smart Management
//               </p>
//             </div>
//           </Link>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             <span className="text-2xl">✕</span>
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto py-4">
//           <div className="px-3 space-y-1">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={onClose}
//                 className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
//                   isActive(item.path)
//                     ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 <span className="text-xl mr-3">{item.icon}</span>
//                 <span>{item.label}</span>
//               </Link>
//             ))}
//           </div>
//         </nav>

//         {/* User Profile Section */}
//         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//           <Link
//             to="/profile"
//             onClick={onClose}
//             className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
//               JD
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                 Fikre Mariam
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                 fikre@example.com
//               </p>
//             </div>
//           </Link>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default Sidebar
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, onClose, collapsed = false }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/appointments", label: "Appointments", icon: "📅" },
    { path: "/cases", label: "Cases", icon: "📋" },
    { path: "/clients", label: "Clients", icon: "👥" },
    { path: "/calendar", label: "Calendar", icon: "🗓️" },
    { path: "/ai-assistant", label: "AI Assistant", icon: "🤖" },
    { path: "/reports", label: "Reports", icon: "📈" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Static user data
  const user = { name: "User Name", email: "user@example.com" };
  const userInitials = "UN";

  return (
    <>
      {/* Desktop Sidebar - NO MARGIN, NO PADDING ON RIGHT */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/dashboard"
            className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"}`}
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI CaseManager
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Smart Management
                </p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center transition-all ${
                  collapsed ? "justify-center px-4 py-3" : "px-6 py-3"
                } ${
                  isActive(item.path)
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={collapsed ? item.label : ""}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="ml-3 font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/profile"
            className={`flex items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              collapsed ? "justify-center p-2" : "space-x-3 p-3"
            }`}
          >
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
              {userInitials}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI CaseManager
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Smart Management
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
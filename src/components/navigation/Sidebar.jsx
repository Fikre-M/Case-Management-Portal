import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ isOpen, onClose, collapsed = false, toggleCollapse }) {
  const location = useLocation();
  const { user } = useAuth();

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

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const userInitials = getUserInitials();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className={`border-b border-gray-200 dark:border-gray-700 ${collapsed ? "p-3" : "p-4"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            <Link
              to="/landing"
              className={`flex items-center hover:opacity-80 transition-opacity ${collapsed ? "justify-center" : "space-x-3"}`}
              title="AI Case Manager"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-xl">🤖</span>
              </div>
              {!collapsed && (
                <div>
                  <div className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                    AI Case Manager
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Smart Management
                  </div>
                </div>
              )}
            </Link>
            {!collapsed && (
              <button
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                title="Collapse sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {collapsed && (
              <button
                onClick={toggleCollapse}
                className="mt-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                title="Expand sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-hidden py-2">
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center transition-all ${
                  collapsed ? "justify-center px-4 py-2.5" : "px-6 py-2.5"
                } ${
                  isActive(item.path)
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={collapsed ? item.label : ""}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="ml-3 font-medium text-sm">{item.label}</span>
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
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/landing"
            onClick={onClose}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <div className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                AI Case Manager
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Smart Management
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-hidden py-2">
          <div className="px-3 space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
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
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
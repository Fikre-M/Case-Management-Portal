// import { useState } from 'react'
// import { Outlet } from 'react-router-dom'
// import { useTheme } from '../context/ThemeContext'
// import Sidebar from '../components/navigation/Sidebar'
// import Topbar from '../components/navigation/Topbar'

// function MainLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const { theme, toggleTheme } = useTheme()

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen)
//   }

//   return (
//     <div className={theme}>
//       <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
//         {/* Sidebar */}
//         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Topbar */}
//           <Topbar
//             onMenuClick={toggleSidebar}
//             darkMode={theme === 'dark'}
//             onToggleDarkMode={toggleTheme}
//           />

//           {/* Page Content */}
//           <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
//             <Outlet />
//           </main>
//         </div>

//         {/* Mobile Overlay */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// export default MainLayout
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";
import AIAssistant from "../components/ai/AIAssistant";
import AIAssistantToggle from "../components/ai/AIAssistantToggle";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const { theme } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleAiAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen);
  };

  return (
    <div className={theme}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
        />

        {/* Main Content Area - NO GAP */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <Topbar
            onMenuClick={toggleSidebar}
            toggleCollapse={toggleCollapse}
            sidebarCollapsed={sidebarCollapsed}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* AI Assistant */}
        <AIAssistant 
          isOpen={aiAssistantOpen} 
          onToggle={toggleAiAssistant}
        />

        {/* AI Assistant Toggle Button */}
        <AIAssistantToggle 
          isOpen={aiAssistantOpen} 
          onToggle={toggleAiAssistant}
        />
      </div>
    </div>
  );
}

export default MainLayout;
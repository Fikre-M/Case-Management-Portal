import { Outlet } from "react-router-dom";
import Footer from "../components/navigation/Footer";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PublicLayout;

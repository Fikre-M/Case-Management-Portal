import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>© {year} AI Case Manager. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/help" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Help
          </Link>
          <Link to="/settings" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Settings
          </Link>
          <span className="text-gray-300 dark:text-gray-600">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

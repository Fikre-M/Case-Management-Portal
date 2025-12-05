import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <input
            type="search"
            placeholder="Search..."
            className="input-field w-64"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">🔔</span>
          </button>
          <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
              U
            </div>
            <span className="font-medium">User</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header

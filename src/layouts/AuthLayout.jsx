import { Outlet } from "react-router-dom";

function AuthLayout() {
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-4 overflow-hidden">
      <div className="container mx-auto h-full flex items-center justify-center">
        {/* Form Card - Always visible */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="space-y-4">
              <Outlet />
            </div>
          </div>
        </div>

        {/* Welcome Content - Hidden on mobile, shown on desktop right side */}
        <div className="hidden lg:block w-1/2 pl-12">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-white mb-3">
              Welcome to AI CaseManager
            </h1>
            <p className="text-primary-100 mb-6">
              Smart Appointment & Case Management
            </p>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-primary-400 bg-opacity-30 p-1.5 rounded-full mr-3">
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    Efficient Case Management
                  </h3>
                  <p className="text-primary-100 text-xs">
                    Organize and track all your cases
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-400 bg-opacity-30 p-1.5 rounded-full mr-3">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">AI-Powered</h3>
                  <p className="text-primary-100 text-xs">
                    Smart case handling and insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

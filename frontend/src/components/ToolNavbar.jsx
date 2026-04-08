import { useNavigate, useLocation } from "react-router-dom";

const ToolNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAboutPage = location.pathname === "/about";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow">
            ⚙️
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DevKit
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          {!isAboutPage && (
            <button
              onClick={() => navigate("/about")}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              About
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ToolNavbar;

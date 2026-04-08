import { useNavigate } from "react-router-dom";
import ToolNavbar from "../components/ToolNavbar";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-5xl mx-auto px-6 py-16 flex items-center justify-center">
        <div className="w-full text-center">
          {/* ICON */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 mb-8 shadow-sm border border-blue-200">
            <span className="text-3xl">🚧</span>
          </div>

          {/* 404 TEXT */}
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Page not found
          </h2>

          <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-10">
            The page you’re looking for doesn’t exist or may have been moved.
            Try going back or explore other tools.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:border-gray-300 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>

          {/* OPTIONAL CARD (same style as your sections) */}
          <div className="mt-16 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-lg mx-auto">
            <p className="text-sm text-gray-500">
              💡 Tip: Check the URL or navigate using the tools menu to find
              what you need faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

// ─────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────
const Navbar = ({ onToolsClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          <button
            onClick={onToolsClick}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors cursor-pointer bg-none border-none p-0"
          >
            Tools
          </button>
          <a
            href="/about"
            className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
          >
            About
          </a>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 active:scale-95">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

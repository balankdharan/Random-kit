// ─────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────
const HeroSection = ({ onExploreClick }) => {
  return (
    <div className="pt-32 pb-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 -right-32 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 mb-6 animate-fadeIn">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            ✨ 100% Free & Open Source
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slideDown">
          <span className="text-gray-900">All your dev tools </span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            in one place
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-slideUp"
          style={{ animationDelay: "0.2s" }}
        >
          Generate keys, passwords, UUIDs, and more. Beautifully designed,
          lightning-fast, and completely free.
        </p>

        {/* CTA Button */}
        <button
          onClick={onExploreClick}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 animate-slideUp"
          style={{ animationDelay: "0.4s" }}
        >
          Explore Tools →
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;

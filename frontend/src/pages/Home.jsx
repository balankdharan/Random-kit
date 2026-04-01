import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import HeroSection from "../components/Hero";
import Navbar from "../components/Navbar";

const tools = [
  {
    name: "API Key Generator",
    description: "Generate secure API keys instantly",
    slug: "api-key-generator",
    category: "Development",
    icon: "🔑",
  },
  {
    name: "Password Generator",
    description: "Create strong and secure passwords",
    slug: "password-generator",
    category: "Security",
    icon: "🔐",
  },
  {
    name: "UUID Generator",
    description: "Generate unique identifiers",
    slug: "uuid-generator",
    category: "Development",
    icon: "🆔",
  },
  {
    name: "Random Number",
    description: "Generate random numbers with range",
    slug: "random-number",
    category: "Utilities",
    icon: "🎲",
  },
  {
    name: "Fake User Generator",
    description: "Generate mock user data",
    slug: "fake-user",
    category: "Testing",
    icon: "👤",
  },
  {
    name: "Color Generator",
    description: "Generate random colors",
    slug: "color-generator",
    category: "Design",
    icon: "🎨",
  },
  {
    name: "JWT Token Generator",
    description: "Create and decode JWT tokens",
    slug: "jwt-generator",
    category: "Development",
    icon: "🔓",
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA hashes",
    slug: "hash-generator",
    category: "Security",
    icon: "#️⃣",
  },
  {
    name: "QR Code Generator",
    description: "Create QR codes for URLs",
    slug: "qr-generator",
    category: "Utilities",
    icon: "📱",
  },
];

const categories = [
  { id: "all", name: "All Tools", count: 9 },
  { id: "development", name: "Development", count: 3 },
  { id: "security", name: "Security", count: 2 },
  { id: "utilities", name: "Utilities", count: 2 },
  { id: "testing", name: "Testing", count: 1 },
  { id: "design", name: "Design", count: 1 },
];

// ─────────────────────────────────────
// FILTER SECTION
// ─────────────────────────────────────
const FilterSection = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 sticky top-20 bg-white/80 backdrop-blur-md border-b border-gray-200/30 z-40">
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              selectedCategory === cat.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name}
            <span
              className={`ml-2 text-xs ${selectedCategory === cat.id ? "text-blue-100" : "text-gray-500"}`}
            >
              ({cat.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// TOOL CARD
// ─────────────────────────────────────
const ToolCard = ({ tool, index, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
      className="group cursor-pointer bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 animate-slideUp"
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />

      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 text-3xl mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
        {tool.icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
          {tool.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
          {tool.description}
        </p>

        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold group-hover:bg-blue-100 transition-colors">
            {tool.category}
          </span>
          <span className="text-gray-400 group-hover:text-blue-600 transition-colors text-lg">
            →
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// MAIN HOME COMPONENT
// ─────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on category and search
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" ||
        tool.category.toLowerCase().replace(" ", "-") === selectedCategory;

      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Smooth scroll to tools section with navbar offset
  const scrollToTools = () => {
    const toolsSection = document.getElementById("tools-section");
    if (toolsSection) {
      const navbarHeight = 300; // Navbar height (64px) + padding
      const targetPosition = toolsSection.offsetTop - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleToolClick = (slug) => {
    navigate(`/tools/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      {/* Navbar */}
      <Navbar onToolsClick={scrollToTools} />

      {/* Hero Section */}
      <HeroSection onExploreClick={scrollToTools} />

      {/* Filter Section */}
      <FilterSection
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Tools Grid */}
      <div id="tools-section" className="max-w-7xl mx-auto px-6 py-12">
        {filteredTools.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory === "all"
                  ? "All Tools"
                  : `${categories.find((c) => c.id === selectedCategory)?.name}`}
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredTools.length} tool
                {filteredTools.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool, index) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  index={index}
                  onClick={() => handleToolClick(tool.slug)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-600">
          <p className="mb-2">Made with ❤️ by developers, for developers</p>
          <p className="text-sm">
            © 2024 DevKit. All rights reserved. | Open source and free to use.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

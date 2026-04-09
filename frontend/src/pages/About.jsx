import ToolNavbar from "../components/ToolNavbar";

const TOOLS = [
  {
    icon: "🔑",
    name: "API Key Generator",
    desc: "Generate secure API keys instantly.",
    category: "Development",
  },
  {
    icon: "🔐",
    name: "Password Generator",
    desc: "Create strong and secure passwords.",
    category: "Security",
  },
  {
    icon: "🆔",
    name: "UUID Generator",
    desc: "Generate unique identifiers in bulk.",
    category: "Development",
  },
  {
    icon: "🎲",
    name: "Random Number",
    desc: "Generate random numbers with range control.",
    category: "Utilities",
  },
  {
    icon: "👤",
    name: "Fake User Generator",
    desc: "Generate realistic mock user data for testing.",
    category: "Testing",
  },
  {
    icon: "🎨",
    name: "Color Generator",
    desc: "Generate palettes, convert and explore colors.",
    category: "Design",
  },
  {
    icon: "🔓",
    name: "JWT Token Generator",
    desc: "Create, decode and verify JWT tokens.",
    category: "Development",
  },
  {
    icon: "#️⃣",
    name: "Hash Generator",
    desc: "Generate MD5, SHA family, BLAKE2 & HMAC hashes.",
    category: "Security",
  },
  {
    icon: "📱",
    name: "QR Code Generator",
    desc: "Create QR codes for URLs and text instantly.",
    category: "Utilities",
  },
];

const CATEGORY_COLORS = {
  Development: "bg-blue-50 border-blue-200 text-blue-700",
  Security: "bg-red-50 border-red-200 text-red-700",
  Utilities: "bg-purple-50 border-purple-200 text-purple-700",
  Testing: "bg-yellow-50 border-yellow-200 text-yellow-700",
  Design: "bg-pink-50 border-pink-200 text-pink-700",
};

const STATS = [
  { value: "9", label: "Tools Available" },
  { value: "100%", label: "Free Forever" },
  { value: "0", label: "Signups Required" },
  { value: "∞", label: "Usage Limits" },
];

const PRINCIPLES = [
  {
    icon: "⚡",
    title: "Fast by Default",
    desc: "Every tool responds instantly. No unnecessary loading states, no waiting around.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your inputs are never stored or logged. Everything runs in real-time and is discarded immediately.",
  },
  {
    icon: "🧩",
    title: "No Bloat",
    desc: "Clean UI, focused features. Each tool does exactly what it says — nothing more, nothing less.",
  },
  {
    icon: "🌐",
    title: "Always Accessible",
    desc: "No account, no paywall, no rate limits. Open and use from anywhere, any time.",
  },
];

const TECH = [
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟩" },
  { name: "Express", icon: "🚂" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Tailwind", icon: "💨" },
  { name: "Vite", icon: "⚡" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* ── HEADER ── */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-5xl font-bold mb-5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            About This Toolkit
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            A collection of simple, powerful developer tools built to solve
            everyday problems quickly.
            <br className="hidden sm:block" />
            <span className="font-medium text-gray-700">
              Free to use — just one developer helping another developer.
            </span>
          </p>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── MISSION ── */}
        <div className="relative bg-white rounded-3xl p-10 shadow-sm border border-gray-200 mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-purple-50/30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-lg">
                💡
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Why This Exists
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-5 text-[15px]">
              As developers, we constantly switch between tools — generating API
              keys, testing JWTs, creating fake data, hashing values…
            </p>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              This toolkit brings everything into one place with a clean
              interface, fast performance, and zero distractions. No more
              hunting across a dozen different sites.
            </p>
          </div>
        </div>

        {/* ── PRINCIPLES ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-lg">
              🎯
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Core Principles
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-lg mb-4">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOOLS LIST ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-lg">
              🛠️
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available Tools
            </h2>
            <span className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              9 Tools
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {TOOLS.map((tool, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-blue-50/40 transition-colors duration-150 ${
                  i !== TOOLS.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 text-lg flex-shrink-0">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {tool.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${CATEGORY_COLORS[tool.category]}`}
                >
                  {tool.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TECH STACK ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-lg">
              ⚙️
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Built With</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {TECH.map((tech, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <span className="text-2xl block mb-2">{tech.icon}</span>
                <p className="text-xs font-semibold text-gray-700">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FREE + CTA ── */}
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 shadow-sm">
              <span>✨</span> 100% Free Tools
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ❤️ Built for Developers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-[15px]">
              Every tool here is completely free to use. No signups, no limits,
              no distractions.
            </p>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-[15px]">
              Just a developer building tools to make life easier for other
              developers.
            </p>
            <div className="mt-8 w-24 h-1 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

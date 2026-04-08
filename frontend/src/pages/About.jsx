import ToolNavbar from "../components/ToolNavbar";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* HEADER */}
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

        {/* MISSION */}
        <div className="relative bg-white rounded-3xl p-10 shadow-sm border border-gray-200 mb-12 overflow-hidden">
          {/* subtle background glow */}
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
              interface, fast performance, and zero distractions.
            </p>
          </div>
        </div>

        {/* FREE + MESSAGE */}
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-3xl p-10 text-center overflow-hidden">
          {/* glow */}
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

            {/* subtle divider */}
            <div className="mt-8 w-24 h-1 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

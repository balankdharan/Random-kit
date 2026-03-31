import { useNavigate } from "react-router-dom";

const tools = [
  {
    name: "API Key Generator",
    description: "Generate secure API keys instantly",
    slug: "api-key-generator",
  },
  {
    name: "Password Generator",
    description: "Create strong and secure passwords",
    slug: "password-generator",
  },
  {
    name: "UUID Generator",
    description: "Generate unique identifiers",
    slug: "uuid-generator",
  },
  {
    name: "Random Number",
    description: "Generate random numbers with range",
    slug: "random-number",
  },
  {
    name: "Fake User Generator",
    description: "Generate mock user data",
    slug: "fake-user",
  },
  {
    name: "Color Generator",
    description: "Generate random colors",
    slug: "color-generator",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* 🔥 Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Dev Utility Tools 🚀
        </h1>
        <p className="text-gray-500 text-lg">
          Generate, test, and explore powerful tools for developers
        </p>
      </div>

      {/* 🧩 Cards Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {tools.map((tool, index) => (
          <div
            key={index}
            onClick={() => navigate(`/tools/${tool.slug}`)}
            className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Icon Placeholder */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold mb-4">
              {tool.name.charAt(0)}
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {tool.name}
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-500">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

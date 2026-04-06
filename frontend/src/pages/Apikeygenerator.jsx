import { useState } from "react";
import {
  Copy,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";

const ApiKeyGenerator = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showKeys, setShowKeys] = useState({});

  // Filter options
  const [filters, setFilters] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: false,
  });

  const [options, setOptions] = useState({
    keyLength: 32,
    quantity: 1,
    usePrefix: false,
    prefix: "sk_live",
  });

  // Toggle filter
  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Update options
  const updateOption = (optionName, value) => {
    setOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Generate API keys
  const handleGenerate = async () => {
    // Validation
    if (
      !filters.includeUppercase &&
      !filters.includeLowercase &&
      !filters.includeNumbers &&
      !filters.includeSpecial
    ) {
      setError("Select at least one character type");
      return;
    }

    if (options.keyLength < 8 || options.keyLength > 512) {
      setError("Key length must be between 8 and 512");
      return;
    }

    if (options.quantity < 1 || options.quantity > 100) {
      setError("Quantity must be between 1 and 100");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/api-key-generator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...filters,
            ...options,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setKeys(data.data.keys);
        setError(null);
      } else {
        setError(data.message || "Failed to generate keys");
      }
    } catch (err) {
      console.error("Error generating keys:", err);
      setError("Failed to generate keys. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Download as text file
  const downloadKeys = () => {
    const text = keys.join("\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", "api-keys.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Toggle show key
  const toggleShowKey = (id) => {
    setShowKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get character preview
  const getCharacterPreview = () => {
    const chars = [];
    if (filters.includeUppercase) chars.push("A-Z");
    if (filters.includeLowercase) chars.push("a-z");
    if (filters.includeNumbers) chars.push("0-9");
    if (filters.includeSpecial) chars.push("!@#$...");
    return chars.join(", ") || "None selected";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            API Key Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate secure, random API keys with custom filters. Choose
            character types and configure your key length.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>⚙️</span> Settings
              </h2>

              {/* Character Filters */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Character Types
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      key: "includeUppercase",
                      label: "A-Z (Uppercase)",
                      icon: "🔤",
                    },
                    {
                      key: "includeLowercase",
                      label: "a-z (Lowercase)",
                      icon: "📝",
                    },
                    {
                      key: "includeNumbers",
                      label: "0-9 (Numbers)",
                      icon: "🔢",
                    },
                    {
                      key: "includeSpecial",
                      label: "!@#$% (Special)",
                      icon: "⚡",
                    },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => toggleFilter(filter.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                        filters[filter.key]
                          ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters[filter.key]}
                        onChange={() => toggleFilter(filter.key)}
                        className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                      />
                      <span className="text-lg">{filter.icon}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {filter.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Length */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                  Key Length:{" "}
                  <span className="text-blue-600">{options.keyLength}</span>
                </label>
                <input
                  type="range"
                  min="8"
                  max="512"
                  value={options.keyLength}
                  onChange={(e) =>
                    updateOption("keyLength", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>8</span>
                  <span>512</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                  Quantity:{" "}
                  <span className="text-blue-600">{options.quantity}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={options.quantity}
                  onChange={(e) =>
                    updateOption(
                      "quantity",
                      Math.min(100, Math.max(1, parseInt(e.target.value))),
                    )
                  }
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Prefix Options */}
              <div className="mb-8">
                <button
                  onClick={() => updateOption("usePrefix", !options.usePrefix)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                    options.usePrefix
                      ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={options.usePrefix}
                    onChange={() =>
                      updateOption("usePrefix", !options.usePrefix)
                    }
                    className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Add Prefix
                  </span>
                </button>

                {options.usePrefix && (
                  <input
                    type="text"
                    value={options.prefix}
                    onChange={(e) => updateOption("prefix", e.target.value)}
                    placeholder="sk_live"
                    className="w-full mt-3 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  />
                )}
              </div>

              {/* Preview */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="text-xs text-gray-600 mb-2">Character Set:</p>
                <p className="text-sm text-blue-700 font-mono">
                  {getCharacterPreview()}
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Generate Keys
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Results */}
            {keys.length > 0 && (
              <div className="space-y-4">
                {/* Header with Actions */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Generated Keys
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {keys.length} key{keys.length !== 1 ? "s" : ""} generated
                      • Length: {options.keyLength}
                    </p>
                  </div>
                  <button
                    onClick={downloadKeys}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all hover:shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                {/* Keys List */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {keys.map((key, index) => (
                    <div
                      key={index}
                      className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm hover:shadow-blue-500/10 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <code className="text-sm text-gray-700 font-mono break-all">
                            {showKeys[index] ? key : "•".repeat(20)}
                          </code>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleShowKey(index)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={showKeys[index] ? "Hide" : "Show"}
                          >
                            {showKeys[index] ? (
                              <EyeOff className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600" />
                            )}
                          </button>

                          <button
                            onClick={() => copyToClipboard(key, index)}
                            className={`p-2 rounded-lg transition-all ${
                              copied === index
                                ? "bg-green-100 text-green-700"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                            title="Copy to clipboard"
                          >
                            {copied === index ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Copy All Button */}
                <button
                  onClick={() => copyToClipboard(keys.join("\n"), "all")}
                  className={`w-full py-3 rounded-lg font-semibold transition-all border ${
                    copied === "all"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-white text-gray-900 border-gray-200 hover:border-blue-300 hover:shadow-sm hover:shadow-blue-500/10"
                  }`}
                >
                  {copied === "all" ? "✓ All Copied!" : "Copy All Keys"}
                </button>
              </div>
            )}

            {/* Empty State */}
            {keys.length === 0 && !loading && (
              <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                <div className="text-center">
                  <div className="text-5xl mb-4">⚙️</div>
                  <p className="text-gray-600">
                    Configure options and click "Generate Keys"
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Your keys will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyGenerator;

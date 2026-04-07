import { useState } from "react";
import {
  Copy,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Shield,
  AlertTriangle,
  Info,
} from "lucide-react";
import ToolNavbar from "../components/ToolNavbar";

const PasswordGenerator = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [analyzerPassword, setAnalyzerPassword] = useState("");
  const [analyzerResult, setAnalyzerResult] = useState(null);
  const [analyzerLoading, setAnalyzerLoading] = useState(false);

  // Filter options
  const [filters, setFilters] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: false,
    excludeAmbiguous: false,
  });

  const [options, setOptions] = useState({
    passwordLength: 16,
    quantity: 1,
    checkPwned: true,
  });

  // Toggle filter
  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Update option
  const updateOption = (optionName, value) => {
    setOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Generate passwords
  const handleGenerate = async () => {
    if (
      !filters.includeUppercase &&
      !filters.includeLowercase &&
      !filters.includeNumbers &&
      !filters.includeSpecial
    ) {
      setError("Select at least one character type");
      return;
    }

    if (options.passwordLength < 4 || options.passwordLength > 128) {
      setError("Password length must be between 4 and 128");
      return;
    }

    if (options.quantity < 1 || options.quantity > 50) {
      setError("Quantity must be between 1 and 50");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/password/password-generator`,
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
        setPasswords(data.data.passwords);
        setError(null);
      } else {
        setError(data.message || "Failed to generate passwords");
      }
    } catch (err) {
      console.error("Error generating passwords:", err);
      setError("Failed to generate passwords. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Analyze password
  const handleAnalyze = async () => {
    if (!analyzerPassword) {
      setError("Enter a password to analyze");
      return;
    }

    try {
      setAnalyzerLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/password/password-analyzer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: analyzerPassword,
            checkPwned: true,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setAnalyzerResult(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to analyze password");
      }
    } catch (err) {
      console.error("Error analyzing password:", err);
      setError("Failed to analyze password. Please try again.");
    } finally {
      setAnalyzerLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Download passwords
  const downloadPasswords = () => {
    const text = passwords.map((p) => p.password).join("\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", "passwords.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Toggle show password
  const toggleShowPassword = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get strength color
  const getStrengthColor = (strength) => {
    switch (strength) {
      case "Very Strong":
        return "text-green-700 bg-green-50 border-green-200";
      case "Strong":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "Good":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "Fair":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "Weak":
      case "Very Weak":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  // Get strength progress bar color
  const getStrengthBarColor = (strength) => {
    switch (strength) {
      case "Very Strong":
        return "bg-green-500";
      case "Strong":
        return "bg-blue-500";
      case "Good":
        return "bg-yellow-500";
      case "Fair":
        return "bg-orange-500";
      case "Weak":
      case "Very Weak":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Password Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate strong passwords and check if they've been exposed. Get
            real-time strength analysis powered by Have I Been Pwned.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3 max-w-6xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24 space-y-8">
              {/* Analyzer Panel - ON TOP */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🔍</span> Analyzer
                </h2>

                {/* HIBP Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-xs text-blue-800">
                    <strong>Have I Been Pwned:</strong> Check if your password
                    has been exposed in known data breaches. Uses secure hash
                    matching.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Enter Password to Analyze
                    </label>
                    <input
                      type="password"
                      value={analyzerPassword}
                      onChange={(e) => setAnalyzerPassword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                      placeholder="Your password here..."
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={analyzerLoading || !analyzerPassword}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {analyzerLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Analyze Password
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200"></div>

              {/* Generator Panel */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>⚙️</span> Generator
                </h2>

                {/* Character Filters */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    Character Types
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: "includeLowercase",
                        label: "a-z (Lowercase)",
                        icon: "📝",
                      },
                      {
                        key: "includeUppercase",
                        label: "A-Z (Uppercase)",
                        icon: "🔤",
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

                {/* Additional Options */}
                <div className="mb-8">
                  <button
                    onClick={() => toggleFilter("excludeAmbiguous")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                      filters.excludeAmbiguous
                        ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.excludeAmbiguous}
                      onChange={() => toggleFilter("excludeAmbiguous")}
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Exclude ambiguous (i, l, 1, L, o, 0, O)
                    </span>
                  </button>
                </div>

                {/* Password Length */}
                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    Length:{" "}
                    <span className="text-blue-600">
                      {options.passwordLength}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={options.passwordLength}
                    onChange={(e) =>
                      updateOption("passwordLength", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>4</span>
                    <span>128</span>
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
                    max="50"
                    value={options.quantity}
                    onChange={(e) =>
                      updateOption(
                        "quantity",
                        Math.min(50, Math.max(1, parseInt(e.target.value))),
                      )
                    }
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                {/* Check Pwned */}
                <div className="mb-6">
                  <button
                    onClick={() =>
                      updateOption("checkPwned", !options.checkPwned)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                      options.checkPwned
                        ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={options.checkPwned}
                      onChange={() =>
                        updateOption("checkPwned", !options.checkPwned)
                      }
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Check "Have I Been Pwned"
                    </span>
                  </button>
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
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analyzer Results */}
            {analyzerResult && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Analysis Results
                </h3>

                {/* Strength Card */}
                <div
                  className={`rounded-lg p-6 border ${getStrengthColor(analyzerResult.strength.strength)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg">Password Strength</h4>
                      <p className="text-sm opacity-75">
                        {analyzerResult.strength.strength}
                      </p>
                    </div>
                    <span className="text-3xl font-bold opacity-20">
                      {analyzerResult.strength.score}/10
                    </span>
                  </div>

                  <div className="w-full bg-current bg-opacity-20 rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full ${getStrengthBarColor(analyzerResult.strength.strength)}`}
                      style={{
                        width: `${analyzerResult.strength.percentage}%`,
                      }}
                    />
                  </div>

                  {/* Feedback */}
                  <div className="space-y-2">
                    {analyzerResult.strength.feedback.map((tip, idx) => (
                      <p key={idx} className="text-sm">
                        • {tip}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Pwned Status Card */}
                {analyzerResult.pwned && (
                  <div
                    className={`rounded-lg p-6 border ${
                      analyzerResult.pwned.isPwned === false
                        ? "bg-green-50 border-green-200"
                        : analyzerResult.pwned.isPwned === true
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {analyzerResult.pwned.isPwned === false ? (
                        <>
                          <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-green-900 mb-1">
                              No Breaches Found
                            </h4>
                            <p className="text-sm text-green-800">
                              This password hasn't been found in any known data
                              breaches. ✓
                            </p>
                          </div>
                        </>
                      ) : analyzerResult.pwned.isPwned === true ? (
                        <>
                          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-red-900 mb-1">
                              Password Exposed
                            </h4>
                            <p className="text-sm text-red-800">
                              This password was found{" "}
                              <strong>
                                {analyzerResult.pwned.count} times
                              </strong>{" "}
                              in data breaches. Please use a different password.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Info className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">
                              Check Unavailable
                            </h4>
                            <p className="text-sm text-gray-700">
                              Couldn't check against breach database. Try again
                              later.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Character Analysis */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4">
                    Character Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Uppercase (A-Z)",
                        value: analyzerResult.analysis.hasUppercase,
                      },
                      {
                        label: "Lowercase (a-z)",
                        value: analyzerResult.analysis.hasLowercase,
                      },
                      {
                        label: "Numbers (0-9)",
                        value: analyzerResult.analysis.hasNumbers,
                      },
                      {
                        label: "Special (!@#$)",
                        value: analyzerResult.analysis.hasSpecial,
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            item.value
                              ? "bg-green-50 border-green-500"
                              : "bg-gray-50 border-gray-300"
                          }`}
                        >
                          {item.value && (
                            <Check className="w-3 h-3 text-green-600" />
                          )}
                        </div>
                        <span
                          className={
                            item.value
                              ? "text-gray-900 font-medium"
                              : "text-gray-500"
                          }
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Generated Passwords */}
            {passwords.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Generated Passwords
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {passwords.length} password
                      {passwords.length !== 1 ? "s" : ""} • Length:{" "}
                      {options.passwordLength}
                    </p>
                  </div>
                  <button
                    onClick={downloadPasswords}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all hover:shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {passwords.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      {/* Password Display */}
                      <div className="group flex items-center justify-between gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <code className="text-sm text-gray-700 font-mono break-all flex-1">
                          {showPasswords[index]
                            ? item.password
                            : "•".repeat(Math.min(item.password.length, 25))}
                        </code>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleShowPassword(index)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {showPasswords[index] ? (
                              <EyeOff className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              copyToClipboard(item.password, index)
                            }
                            className={`p-2 rounded-lg transition-all ${
                              copied === index
                                ? "bg-green-100 text-green-700"
                                : "hover:bg-gray-200 text-gray-600"
                            }`}
                          >
                            {copied === index ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Strength Indicator */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">
                              Strength
                            </span>
                            <span
                              className={`text-xs font-bold ${getStrengthColor(item.strength.strength).split(" ")[0]}`}
                            >
                              {item.strength.strength}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${getStrengthBarColor(item.strength.strength)}`}
                              style={{ width: `${item.strength.percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Pwned Status */}
                        {item.pwned && (
                          <div className="flex-shrink-0">
                            {item.pwned.isPwned === false ? (
                              <div className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-xs font-semibold text-green-700">
                                  Safe
                                </span>
                              </div>
                            ) : item.pwned.isPwned === true ? (
                              <div className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-xs font-semibold text-red-700">
                                  Exposed
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
                                <Info className="w-4 h-4 text-gray-600" />
                                <span className="text-xs font-semibold text-gray-700">
                                  N/A
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Pwned Details */}
                      {item.pwned && item.pwned.isPwned && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs text-red-700">
                            <strong>⚠️ Found {item.pwned.count} times</strong>{" "}
                            in data breaches. Consider using a different
                            password.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Copy All Button */}
                <button
                  onClick={() =>
                    copyToClipboard(
                      passwords.map((p) => p.password).join("\n"),
                      "all",
                    )
                  }
                  className={`w-full py-3 rounded-lg font-semibold transition-all border ${
                    copied === "all"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-white text-gray-900 border-gray-200 hover:border-blue-300 hover:shadow-sm hover:shadow-blue-500/10"
                  }`}
                >
                  {copied === "all" ? "✓ All Copied!" : "Copy All Passwords"}
                </button>
              </div>
            )}

            {/* Empty State */}
            {passwords.length === 0 &&
              !analyzerResult &&
              !loading &&
              !analyzerLoading && (
                <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🔐</div>
                    <p className="text-gray-600">
                      Analyze existing passwords or generate new ones
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Get instant strength analysis and breach detection
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

export default PasswordGenerator;

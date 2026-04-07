import { useState } from "react";
import {
  Copy,
  RotateCcw,
  Download,
  Check,
  AlertCircle,
  Info,
  TrendingUp,
} from "lucide-react";
import ToolNavbar from "../components/ToolNavbar";

const RandomNumberGenerator = () => {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  // Generator options
  const [options, setOptions] = useState({
    min: 1,
    max: 100,
    quantity: 10,
    distribution: "uniform",
    decimalPlaces: 0,
    unique: false,
  });

  // Update option
  const updateOption = (optionName, value) => {
    setOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Generate random numbers
  const handleGenerate = async () => {
    // Validation
    if (options.min >= options.max) {
      setError("Min must be less than max");
      return;
    }

    if (options.quantity < 1 || options.quantity > 1000) {
      setError("Quantity must be between 1 and 1000");
      return;
    }

    if (options.decimalPlaces < 0 || options.decimalPlaces > 15) {
      setError("Decimal places must be between 0 and 15");
      return;
    }

    // Check unique constraint
    if (options.unique) {
      const range = options.max - options.min + 1;
      if (options.quantity > range) {
        setError(
          `Cannot generate ${options.quantity} unique numbers in range ${options.min}-${options.max}`,
        );
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/random-number`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(options),
        },
      );

      const data = await response.json();

      if (data.success) {
        setNumbers(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to generate numbers");
      }
    } catch (err) {
      console.error("Error generating numbers:", err);
      setError("Failed to generate numbers. Please try again.");
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

  // Download numbers
  const downloadNumbers = () => {
    const text = numbers.numbers.join("\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", "random-numbers.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Copy as CSV
  const copyAsCSV = () => {
    const text = numbers.numbers.join(",");
    copyToClipboard(text, "csv");
  };

  // Copy as JSON
  const copyAsJSON = () => {
    const text = JSON.stringify(numbers.numbers);
    copyToClipboard(text, "json");
  };

  // Get distribution description
  const getDistributionDescription = (dist) => {
    switch (dist) {
      case "uniform":
        return "Equal probability across entire range";
      case "normal":
        return "Bell curve distribution, clustered around mean";
      case "exponential":
        return "Decreasing probability (common in real-world)";
      case "poisson":
        return "Count of events in fixed interval";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <span className="text-3xl">🎲</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Random Number Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate random numbers with various distributions. Includes
            statistical analysis and multiple output formats.
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>⚙️</span> Generator
              </h2>

              {/* Min & Max */}
              <div className="mb-8 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Min: <span className="text-blue-600">{options.min}</span>
                  </label>
                  <input
                    type="number"
                    value={options.min}
                    onChange={(e) =>
                      updateOption("min", Number(e.target.value))
                    }
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Max: <span className="text-blue-600">{options.max}</span>
                  </label>
                  <input
                    type="number"
                    value={options.max}
                    onChange={(e) =>
                      updateOption("max", Number(e.target.value))
                    }
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Distribution */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                  Distribution
                </label>
                <div className="space-y-3">
                  {["uniform", "normal", "exponential", "poisson"].map(
                    (dist) => (
                      <button
                        key={dist}
                        onClick={() => updateOption("distribution", dist)}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                          options.distribution === dist
                            ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="distribution"
                          value={dist}
                          checked={options.distribution === dist}
                          onChange={() => updateOption("distribution", dist)}
                          className="w-4 h-4 mt-1 cursor-pointer accent-blue-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {dist}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {getDistributionDescription(dist)}
                          </p>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Decimal Places */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                  Decimal Places:{" "}
                  <span className="text-blue-600">{options.decimalPlaces}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={options.decimalPlaces}
                  onChange={(e) =>
                    updateOption("decimalPlaces", Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0 (Integer)</span>
                  <span>15 (Max)</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                  Quantity:{" "}
                  <span className="text-blue-600">{options.quantity}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={options.quantity}
                  onChange={(e) =>
                    updateOption(
                      "quantity",
                      Math.min(1000, Math.max(1, Number(e.target.value))),
                    )
                  }
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Unique */}
              <div className="mb-8">
                <button
                  onClick={() => updateOption("unique", !options.unique)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                    options.unique
                      ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={options.unique}
                    onChange={() => updateOption("unique", !options.unique)}
                    className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Unique Values
                  </span>
                </button>
              </div>

              {/* Range Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="text-xs text-blue-800 mb-2">
                  <strong>Range:</strong> {options.max - options.min + 1}{" "}
                  possible values
                </p>
                {options.unique &&
                  options.quantity > options.max - options.min + 1 && (
                    <p className="text-xs text-red-700">
                      ⚠️ Cannot generate {options.quantity} unique values in
                      this range
                    </p>
                  )}
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

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-8">
            {numbers.numbers && numbers.numbers.length > 0 && (
              <>
                {/* Statistics */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Statistics
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Count", value: numbers.statistics.count },
                      { label: "Min", value: numbers.statistics.min },
                      { label: "Max", value: numbers.statistics.max },
                      { label: "Mean", value: numbers.statistics.mean },
                      { label: "Median", value: numbers.statistics.median },
                      { label: "Range", value: numbers.statistics.range },
                      {
                        label: "Std Dev",
                        value: numbers.statistics.standardDeviation,
                      },
                      { label: "Variance", value: numbers.statistics.variance },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <p className="text-xs font-semibold text-gray-600 mb-1 uppercase">
                          {stat.label}
                        </p>
                        <p className="text-lg font-bold text-gray-900 font-mono">
                          {typeof stat.value === "number"
                            ? stat.value.toLocaleString()
                            : stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Numbers List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Generated Numbers
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {numbers.count} {options.distribution} distribution
                        numbers
                      </p>
                    </div>
                    <button
                      onClick={downloadNumbers}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all hover:shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>

                  {/* Format Options with Metadata */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700">
                      📋 Copy Format:
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Space Separated */}
                      <div className="group relative">
                        <button
                          onClick={() =>
                            copyToClipboard(numbers.numbers.join(" "), "space")
                          }
                          className={`w-full px-3 py-3 text-xs font-medium rounded-lg transition-all border flex flex-col items-center gap-1.5 ${
                            copied === "space"
                              ? "bg-green-50 text-green-700 border-green-300"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                          // title="Copy numbers separated by spaces"
                        >
                          <span className="text-lg">📝</span>
                          <span className="font-semibold">
                            {copied === "space" ? "✓ Copied" : "Space"}
                          </span>
                        </button>
                        {/* Tooltip */}
                        <div className="absolute left-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg">
                            <p className="font-semibold mb-1.5 text-blue-300">
                              Space Separated
                            </p>
                            <code className="block bg-black/40 p-2 rounded mb-2 break-all text-gray-200 text-xs">
                              {numbers.numbers.slice(0, 3).join(" ")} ...
                            </code>
                            <p className="text-gray-300 text-xs">
                              <strong>Use for:</strong> Text editors, Word,
                              documents
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CSV Format */}
                      <div className="group relative">
                        <button
                          onClick={copyAsCSV}
                          className={`w-full px-3 py-3 text-xs font-medium rounded-lg transition-all border flex flex-col items-center gap-1.5 ${
                            copied === "csv"
                              ? "bg-green-50 text-green-700 border-green-300"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                          // title="Copy numbers as comma-separated values"
                        >
                          <span className="text-lg">📊</span>
                          <span className="font-semibold">
                            {copied === "csv" ? "✓ Copied" : "CSV"}
                          </span>
                        </button>
                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg">
                            <p className="font-semibold mb-1.5 text-blue-300">
                              CSV (Comma Separated)
                            </p>
                            <code className="block bg-black/40 p-2 rounded mb-2 break-all text-gray-200 text-xs">
                              {numbers.numbers.slice(0, 3).join(",")}...
                            </code>
                            <p className="text-gray-300 text-xs">
                              <strong>Use for:</strong> Excel, Google Sheets,
                              databases
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* JSON Format */}
                      <div className="group relative">
                        <button
                          onClick={copyAsJSON}
                          className={`w-full px-3 py-3 text-xs font-medium rounded-lg transition-all border flex flex-col items-center gap-1.5 ${
                            copied === "json"
                              ? "bg-green-50 text-green-700 border-green-300"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                          // title="Copy numbers as JSON array"
                        >
                          <span className="text-lg">{}</span>
                          <span className="font-semibold">
                            {copied === "json" ? "✓ Copied" : "JSON"}
                          </span>
                        </button>
                        {/* Tooltip */}
                        <div className="absolute right-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg">
                            <p className="font-semibold mb-1.5 text-blue-300">
                              JSON Array
                            </p>
                            <code className="block bg-black/40 p-2 rounded mb-2 break-all text-gray-200 text-xs">
                              [{numbers.numbers.slice(0, 3).join(", ")}...]
                            </code>
                            <p className="text-gray-300 text-xs">
                              <strong>Use for:</strong> APIs, JavaScript, code
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Numbers Grid */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {numbers.numbers.map((num, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            copyToClipboard(num.toString(), `num-${idx}`)
                          }
                          className={`p-3 rounded-lg text-sm font-mono font-semibold transition-all border text-center ${
                            copied === `num-${idx}`
                              ? "bg-green-50 text-green-700 border-green-300"
                              : "bg-gray-50 text-gray-900 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                          title="Click to copy"
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visualization Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <Info className="w-4 h-4 inline mr-2" />
                      <strong>Distribution:</strong> {options.distribution} •
                      <strong className="ml-2">Range:</strong> {options.min} to{" "}
                      {options.max} •<strong className="ml-2">Decimals:</strong>{" "}
                      {options.decimalPlaces}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {(!numbers.numbers || numbers.numbers.length === 0) && !loading && (
              <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎲</div>
                  <p className="text-gray-600">
                    Configure options and generate random numbers
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Get instant statistics and multiple export formats
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

export default RandomNumberGenerator;

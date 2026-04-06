import { useState } from "react";
import {
  Copy,
  RotateCcw,
  Download,
  Check,
  AlertCircle,
  Info,
} from "lucide-react";

const UUIDGenerator = () => {
  const [uuids, setUUIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [validatorUUID, setValidatorUUID] = useState("");
  const [validatorResult, setValidatorResult] = useState(null);
  const [validatorLoading, setValidatorLoading] = useState(false);

  // Generator options
  const [options, setOptions] = useState({
    version: "v4",
    quantity: 1,
    format: "standard",
    uppercase: false,
  });

  // V5 specific options
  const [v5Options, setV5Options] = useState({
    namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", // DNS namespace
    name: "example.com",
  });

  // Update option
  const updateOption = (optionName, value) => {
    setOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Update V5 option
  const updateV5Option = (optionName, value) => {
    setV5Options((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Generate UUIDs
  const handleGenerate = async () => {
    if (options.quantity < 1 || options.quantity > 100) {
      setError("Quantity must be between 1 and 100");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const body = {
        version: options.version,
        quantity: options.quantity,
        format: options.format,
        uppercase: options.uppercase,
      };

      // Add V5 specific options
      if (options.version === "v5") {
        body.namespace = v5Options.namespace;
        body.name = v5Options.name;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/uuid-generator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (data.success) {
        setUUIDs(data.data.uuids);
        setError(null);
      } else {
        setError(data.message || "Failed to generate UUIDs");
      }
    } catch (err) {
      console.error("Error generating UUIDs:", err);
      setError("Failed to generate UUIDs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Validate UUID
  const handleValidate = async () => {
    if (!validatorUUID.trim()) {
      setError("Enter a UUID to validate");
      return;
    }

    try {
      setValidatorLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/uuid-validator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: validatorUUID,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setValidatorResult(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to validate UUID");
      }
    } catch (err) {
      console.error("Error validating UUID:", err);
      setError("Failed to validate UUID. Please try again.");
    } finally {
      setValidatorLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Download UUIDs
  const downloadUUIDs = () => {
    const text = uuids.map((u) => u.uuid).join("\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", "uuids.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getVersionDescription = (version) => {
    switch (version) {
      case "v1":
        return "Time-based UUID using MAC address and timestamp";
      case "v4":
        return "Random UUID (most commonly used)";
      case "v5":
        return "Name-based UUID using SHA-1 hash";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <span className="text-3xl">🆔</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            UUID Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate and validate UUIDs in various formats. Support for UUID v1,
            v4, and v5 with multiple output formats.
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
              {/* Validator Panel */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🔍</span> Validator
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-xs text-blue-800">
                    <strong>Validate UUID:</strong> Check if your UUID is valid
                    and get detailed information about its version and format.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Enter UUID
                    </label>
                    <input
                      type="text"
                      value={validatorUUID}
                      onChange={(e) => setValidatorUUID(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleValidate()}
                      placeholder="550e8400-e29b-41d4-a716-446655440000"
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-mono"
                    />
                  </div>

                  <button
                    onClick={handleValidate}
                    disabled={validatorLoading || !validatorUUID.trim()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {validatorLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Validate
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

                {/* UUID Version */}
                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    UUID Version
                  </label>
                  <div className="space-y-3">
                    {["v1", "v4", "v5"].map((v) => (
                      <button
                        key={v}
                        onClick={() => updateOption("version", v)}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                          options.version === v
                            ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="version"
                          value={v}
                          checked={options.version === v}
                          onChange={() => updateOption("version", v)}
                          className="w-4 h-4 mt-1 cursor-pointer accent-blue-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {v.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {getVersionDescription(v)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* V5 Namespace & Name */}
                {options.version === "v5" && (
                  <div className="mb-8 space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Namespace UUID
                      </label>
                      <select
                        value={v5Options.namespace}
                        onChange={(e) =>
                          updateV5Option("namespace", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      >
                        <option value="6ba7b810-9dad-11d1-80b4-00c04fd430c8">
                          DNS (6ba7b810...)
                        </option>
                        <option value="6ba7b811-9dad-11d1-80b4-00c04fd430c8">
                          URL (6ba7b811...)
                        </option>
                        <option value="6ba7b812-9dad-11d1-80b4-00c04fd430c8">
                          OID (6ba7b812...)
                        </option>
                        <option value="6ba7b814-9dad-11d1-80b4-00c04fd430c8">
                          X.500 (6ba7b814...)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Name
                      </label>
                      <input
                        type="text"
                        value={v5Options.name}
                        onChange={(e) => updateV5Option("name", e.target.value)}
                        placeholder="example.com"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Format */}
                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    Format
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "standard", label: "Standard (with hyphens)" },
                      { value: "no-hyphens", label: "No hyphens" },
                      { value: "braces", label: "With braces {xxx}" },
                      { value: "urn", label: "URN format (urn:uuid:xxx)" },
                    ].map((fmt) => (
                      <button
                        key={fmt.value}
                        onClick={() => updateOption("format", fmt.value)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 border text-sm ${
                          options.format === fmt.value
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={fmt.value}
                          checked={options.format === fmt.value}
                          onChange={() => updateOption("format", fmt.value)}
                          className="w-4 h-4 cursor-pointer accent-blue-600"
                        />
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Case */}
                <div className="mb-8">
                  <button
                    onClick={() =>
                      updateOption("uppercase", !options.uppercase)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                      options.uppercase
                        ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={options.uppercase}
                      onChange={() =>
                        updateOption("uppercase", !options.uppercase)
                      }
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Uppercase
                    </span>
                  </button>
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
            {/* Validator Results */}
            {validatorResult && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Validation Result
                </h3>

                {validatorResult.isValid ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-green-900 mb-2">
                            Valid UUID
                          </h4>
                          <p className="text-sm text-green-800 font-mono break-all">
                            {validatorResult.uuid}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* UUID Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-4">
                        UUID Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            VERSION
                          </p>
                          <p className="text-sm font-mono text-gray-900">
                            {validatorResult.version.toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            LENGTH
                          </p>
                          <p className="text-sm font-mono text-gray-900">
                            {validatorResult.length} characters
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            FORMAT
                          </p>
                          <p className="text-sm font-mono text-gray-900">
                            {validatorResult.format}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            VALIDITY
                          </p>
                          <p className="text-sm font-mono text-green-600">
                            ✓ Valid
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* UUID Components */}
                    {validatorResult.components && (
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="font-bold text-gray-900 mb-4">
                          UUID Components
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(validatorResult.components).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                              >
                                <span className="text-xs font-semibold text-gray-700 uppercase">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <code className="text-sm text-gray-900 font-mono">
                                  {value}
                                </code>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-900 mb-1">
                          Invalid UUID
                        </h4>
                        <p className="text-sm text-red-800">
                          The provided string is not a valid UUID format.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Generated UUIDs */}
            {uuids.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Generated UUIDs
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {uuids.length} UUID{uuids.length !== 1 ? "s" : ""} (v
                      {options.version}) • {options.format}
                    </p>
                  </div>
                  <button
                    onClick={downloadUUIDs}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all hover:shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {uuids.map((item, index) => (
                    <div
                      key={index}
                      className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm hover:shadow-blue-500/10 transition-all"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <code className="text-sm text-gray-700 font-mono break-all flex-1">
                          {item.uuid}
                        </code>
                        <button
                          onClick={() => copyToClipboard(item.uuid, index)}
                          className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                            copied === index
                              ? "bg-green-100 text-green-700"
                              : "hover:bg-gray-100 text-gray-600"
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
                  ))}
                </div>

                {/* Copy All Button */}
                <button
                  onClick={() =>
                    copyToClipboard(uuids.map((u) => u.uuid).join("\n"), "all")
                  }
                  className={`w-full py-3 rounded-lg font-semibold transition-all border ${
                    copied === "all"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-white text-gray-900 border-gray-200 hover:border-blue-300 hover:shadow-sm hover:shadow-blue-500/10"
                  }`}
                >
                  {copied === "all" ? "✓ All Copied!" : "Copy All UUIDs"}
                </button>
              </div>
            )}

            {/* Empty State */}
            {uuids.length === 0 &&
              !validatorResult &&
              !loading &&
              !validatorLoading && (
                <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🆔</div>
                    <p className="text-gray-600">
                      Generate UUIDs or validate existing ones
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Support for UUID v1, v4, and v5 with multiple formats
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

export default UUIDGenerator;

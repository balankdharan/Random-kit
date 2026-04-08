import { useState } from "react";
import {
  Copy,
  RotateCcw,
  Check,
  AlertCircle,
  Info,
  ShieldCheck,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  KeyRound,
} from "lucide-react";
import ToolNavbar from "../components/ToolNavbar";

const JWT_EXPIRY_PRESETS = [
  { label: "15 min", seconds: 900 },
  { label: "1 hour", seconds: 3600 },
  { label: "1 day", seconds: 86400 },
  { label: "7 days", seconds: 604800 },
  { label: "30 days", seconds: 2592000 },
  { label: "Never", seconds: 0 },
];

const JWTTokenGenerator = () => {
  const [activeTab, setActiveTab] = useState("generate"); // "generate" | "decode"
  const [result, setResult] = useState(null);
  const [decodeResult, setDecodeResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [expandedPart, setExpandedPart] = useState(null); // "header" | "payload" | "signature"

  // Generator options
  const [options, setOptions] = useState({
    algorithm: "HS256",
    secret: "",
    expiresIn: 3600,
    includeIat: true,
    includeJti: false,
    issuer: "",
    audience: "",
    subject: "",
    payloadRaw: `{\n  "userId": "123",\n  "role": "admin"\n}`,
  });

  // Decode options
  const [decodeOptions, setDecodeOptions] = useState({
    token: "",
    secret: "",
  });

  const updateOption = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerate = async () => {
    setError(null);

    if (!options.secret || options.secret.trim().length < 8) {
      setError("Secret key must be at least 8 characters long");
      return;
    }

    let payload;
    try {
      payload = JSON.parse(options.payloadRaw);
    } catch {
      setError("Invalid JSON in payload field");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/jwt-generator`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            algorithm: options.algorithm,
            secret: options.secret,
            expiresIn: options.expiresIn,
            includeIat: options.includeIat,
            includeJti: options.includeJti,
            issuer: options.issuer,
            audience: options.audience,
            subject: options.subject,
            payload,
          }),
        },
      );

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || "Failed to generate token");
      }
    } catch (err) {
      setError("Failed to generate token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecode = async () => {
    setError(null);

    if (!decodeOptions.token.trim()) {
      setError("JWT token is required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/jwt-decoder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(decodeOptions),
        },
      );

      const data = await response.json();
      if (data.success) {
        setDecodeResult(data.data);
      } else {
        setError(data.message || "Failed to decode token");
      }
    } catch (err) {
      setError("Failed to decode token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAlgorithmColor = (alg) => {
    switch (alg) {
      case "HS256":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "HS384":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "HS512":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const colorizeToken = (token) => {
    if (!token) return null;
    const [header, payload, signature] = token.split(".");
    return (
      <span className="break-all font-mono text-sm leading-relaxed">
        <span className="text-red-500">{header}</span>
        <span className="text-gray-400">.</span>
        <span className="text-purple-500">{payload}</span>
        <span className="text-gray-400">.</span>
        <span className="text-blue-500">{signature}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JWT Token Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate and decode JSON Web Tokens with custom payloads,
            algorithms, and expiry. Inspect each part of the token visually.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1">
            {["generate", "decode"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setError(null);
                }}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "generate" ? "🔐 Generate" : "🔍 Decode & Verify"}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3 max-w-6xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* ──────────── GENERATE TAB ──────────── */}
        {activeTab === "generate" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>⚙️</span> Configuration
                </h2>

                {/* Algorithm */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    Algorithm
                  </label>
                  <div className="space-y-2">
                    {["HS256", "HS384", "HS512"].map((alg) => (
                      <button
                        key={alg}
                        onClick={() => updateOption("algorithm", alg)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                          options.algorithm === alg
                            ? "bg-blue-50 border-blue-300 shadow-sm"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={options.algorithm === alg}
                          onChange={() => updateOption("algorithm", alg)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {alg}
                          </p>
                          <p className="text-xs text-gray-500">
                            HMAC SHA-{alg.slice(2)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secret */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecret ? "text" : "password"}
                      value={options.secret}
                      onChange={(e) => updateOption("secret", e.target.value)}
                      placeholder="Enter secret key (min 8 chars)"
                      className="w-full px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowSecret((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecret ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {options.secret && options.secret.length < 8 && (
                    <p className="text-xs text-red-500 mt-1">
                      Minimum 8 characters required
                    </p>
                  )}
                </div>

                {/* Expiry Presets */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Expires In:{" "}
                    <span className="text-blue-600">
                      {options.expiresIn === 0
                        ? "Never"
                        : `${options.expiresIn}s`}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {JWT_EXPIRY_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() =>
                          updateOption("expiresIn", preset.seconds)
                        }
                        className={`px-2 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          options.expiresIn === preset.seconds
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Claims */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Optional Claims
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: "includeIat", label: "Include iat (issued at)" },
                      { key: "includeJti", label: "Include jti (JWT ID)" },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => updateOption(key, !options[key])}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all border text-sm ${
                          options[key]
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={options[key]}
                          onChange={() => updateOption(key, !options[key])}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-gray-700 font-medium">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Registered Claims */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block uppercase tracking-wide">
                    Registered Claims (optional)
                  </label>
                  {[
                    {
                      key: "issuer",
                      label: "Issuer (iss)",
                      placeholder: "e.g. myapp.com",
                    },
                    {
                      key: "audience",
                      label: "Audience (aud)",
                      placeholder: "e.g. api.myapp.com",
                    },
                    {
                      key: "subject",
                      label: "Subject (sub)",
                      placeholder: "e.g. user:123",
                    },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-600 mb-1 block">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={options[key]}
                        onChange={(e) => updateOption(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  ))}
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
                      Generate Token
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Custom Payload */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📦</span> Custom Payload (JSON)
                </h3>
                <textarea
                  value={options.payloadRaw}
                  onChange={(e) => updateOption("payloadRaw", e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Standard claims (iat, exp, iss, aud, sub) will be merged
                  automatically based on your settings.
                </p>
              </div>

              {/* Generated Token */}
              {result && (
                <>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        Generated Token
                      </h3>
                      <div className="flex gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getAlgorithmColor(result.algorithm)}`}
                        >
                          {result.algorithm}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(result.token, "full-token")
                          }
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            copied === "full-token"
                              ? "bg-green-50 text-green-700 border-green-300"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          {copied === "full-token" ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copied === "full-token" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div
                      className="bg-gray-950 rounded-xl p-5 select-all cursor-pointer"
                      onClick={() =>
                        copyToClipboard(result.token, "full-token")
                      }
                    >
                      {colorizeToken(result.token)}
                    </div>

                    <div className="flex gap-4 mt-4 text-xs text-gray-500">
                      <span>
                        Length:{" "}
                        <strong className="text-gray-700">
                          {result.tokenLength} chars
                        </strong>
                      </span>
                      {result.expiresAt && (
                        <span>
                          Expires:{" "}
                          <strong className="text-gray-700">
                            {new Date(result.expiresAt).toLocaleString()}
                          </strong>
                        </span>
                      )}
                      {!result.expiresAt && (
                        <span>
                          Expires:{" "}
                          <strong className="text-gray-700">Never</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Color Legend */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 flex flex-wrap gap-5 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />{" "}
                      Header
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-purple-400 inline-block" />{" "}
                      Payload
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />{" "}
                      Signature
                    </span>
                  </div>

                  {/* Decoded Parts */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      Decoded Parts
                    </h3>

                    {[
                      {
                        id: "header",
                        label: "Header",
                        color: "red",
                        content: result.decoded.header,
                        encoded: result.parts.header,
                      },
                      {
                        id: "payload",
                        label: "Payload",
                        color: "purple",
                        content: result.decoded.payload,
                        encoded: result.parts.payload,
                      },
                      {
                        id: "signature",
                        label: "Signature",
                        color: "blue",
                        content: null,
                        encoded: result.parts.signature,
                      },
                    ].map(({ id, label, color, content, encoded }) => (
                      <div
                        key={id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedPart(expandedPart === id ? null : id)
                          }
                          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-3 h-3 rounded-full bg-${color}-400`}
                            />
                            <span className="font-semibold text-gray-800 text-sm">
                              {label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(encoded, `${id}-encoded`);
                              }}
                              className={`p-1.5 rounded-lg border text-xs transition-all ${
                                copied === `${id}-encoded`
                                  ? "bg-green-50 border-green-300 text-green-700"
                                  : "border-gray-200 text-gray-500 hover:border-blue-300"
                              }`}
                            >
                              {copied === `${id}-encoded` ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {expandedPart === id ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {expandedPart === id && (
                          <div className="px-5 pb-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mt-3 mb-2 font-semibold uppercase">
                              Base64URL Encoded
                            </p>
                            <p className="font-mono text-xs text-gray-600 break-all bg-gray-50 p-3 rounded-lg">
                              {encoded}
                            </p>
                            {content && (
                              <>
                                <p className="text-xs text-gray-500 mt-3 mb-2 font-semibold uppercase">
                                  Decoded JSON
                                </p>
                                <pre className="font-mono text-xs text-gray-800 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                                  {JSON.stringify(content, null, 2)}
                                </pre>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Empty State */}
              {!result && !loading && (
                <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <KeyRound className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Configure options and generate a JWT token
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supports HS256, HS384, HS512 algorithms
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────────── DECODE TAB ──────────── */}
        {activeTab === "decode" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🔍</span> Decoder
                </h2>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    JWT Token
                  </label>
                  <textarea
                    value={decodeOptions.token}
                    onChange={(e) =>
                      setDecodeOptions((p) => ({ ...p, token: e.target.value }))
                    }
                    rows={6}
                    placeholder="Paste your JWT token here..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg font-mono text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    spellCheck={false}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Secret Key (optional, for verification)
                  </label>
                  <div className="relative">
                    <input
                      type={showSecret ? "text" : "password"}
                      value={decodeOptions.secret}
                      onChange={(e) =>
                        setDecodeOptions((p) => ({
                          ...p,
                          secret: e.target.value,
                        }))
                      }
                      placeholder="Enter secret to verify signature"
                      className="w-full px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg font-mono text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      onClick={() => setShowSecret((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecret ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDecode}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Decoding...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Decode Token
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Decode Results */}
            <div className="lg:col-span-2 space-y-6">
              {decodeResult && (
                <>
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${
                        decodeResult.isExpired
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-green-50 border-green-300 text-green-700"
                      }`}
                    >
                      <span>{decodeResult.isExpired ? "⚠️" : "✅"}</span>
                      {decodeResult.isExpired ? "Expired" : "Not Expired"}
                    </span>

                    {decodeResult.isValid !== null && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${
                          decodeResult.isValid
                            ? "bg-green-50 border-green-300 text-green-700"
                            : "bg-red-50 border-red-300 text-red-700"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Signature {decodeResult.isValid ? "Valid" : "Invalid"}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border bg-gray-50 border-gray-200 text-gray-700">
                      <Info className="w-4 h-4" />
                      {decodeResult.tokenLength} chars
                    </span>
                  </div>

                  {/* Timestamps */}
                  {(decodeResult.issuedAt || decodeResult.expiresAt) && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5 grid sm:grid-cols-2 gap-4">
                      {decodeResult.issuedAt && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                            Issued At
                          </p>
                          <p className="text-sm font-mono text-gray-800">
                            {new Date(decodeResult.issuedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {decodeResult.expiresAt && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                            Expires At
                          </p>
                          <p
                            className={`text-sm font-mono ${decodeResult.isExpired ? "text-red-600" : "text-gray-800"}`}
                          >
                            {new Date(decodeResult.expiresAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Header */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-red-50 border-b border-red-100">
                      <span className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="font-semibold text-gray-800 text-sm">
                        Header
                      </span>
                    </div>
                    <pre className="px-5 py-4 font-mono text-sm text-gray-800 overflow-x-auto">
                      {JSON.stringify(decodeResult.decoded.header, null, 2)}
                    </pre>
                  </div>

                  {/* Payload */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 bg-purple-50 border-b border-purple-100">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-purple-400" />
                        <span className="font-semibold text-gray-800 text-sm">
                          Payload
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(
                              decodeResult.decoded.payload,
                              null,
                              2,
                            ),
                            "decoded-payload",
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          copied === "decoded-payload"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {copied === "decoded-payload" ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copied === "decoded-payload" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <pre className="px-5 py-4 font-mono text-sm text-gray-800 overflow-x-auto">
                      {JSON.stringify(decodeResult.decoded.payload, null, 2)}
                    </pre>
                  </div>

                  {/* Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <Info className="w-4 h-4 inline mr-2" />
                      {decodeResult.isValid === null
                        ? "Provide a secret key to verify the signature."
                        : decodeResult.isValid
                          ? "✅ Signature verified successfully with the provided secret."
                          : "❌ Signature does not match the provided secret."}
                    </p>
                  </div>
                </>
              )}

              {!decodeResult && !loading && (
                <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Paste a JWT token to decode and inspect it
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Optionally provide your secret to verify the signature
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JWTTokenGenerator;

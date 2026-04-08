import { useState, useRef } from "react";
import {
  Copy,
  Check,
  AlertCircle,
  Info,
  ShieldCheck,
  ShieldX,
  Upload,
  Hash,
  RotateCcw,
} from "lucide-react";
import ToolNavbar from "../components/ToolNavbar";

const ALL_ALGORITHMS = [
  { id: "md5", label: "MD5", bits: 128, note: "Legacy, not collision-safe" },
  { id: "sha1", label: "SHA-1", bits: 160, note: "Deprecated for security" },
  { id: "sha224", label: "SHA-224", bits: 224, note: "SHA-2 family" },
  { id: "sha256", label: "SHA-256", bits: 256, note: "Recommended standard" },
  { id: "sha384", label: "SHA-384", bits: 384, note: "SHA-2 family" },
  {
    id: "sha512",
    label: "SHA-512",
    bits: 512,
    note: "SHA-2 family, strongest",
  },
  { id: "sha3-256", label: "SHA3-256", bits: 256, note: "SHA-3 family" },
  { id: "sha3-512", label: "SHA3-512", bits: 512, note: "SHA-3 family" },
  { id: "ripemd160", label: "RIPEMD-160", bits: 160, note: "Used in Bitcoin" },
  { id: "blake2b512", label: "BLAKE2b-512", bits: 512, note: "Fast & secure" },
  {
    id: "blake2s256",
    label: "BLAKE2s-256",
    bits: 256,
    note: "Optimized for 32-bit",
  },
];

const DEFAULT_SELECTED = ["md5", "sha1", "sha256", "sha512"];

const ENCODING_OPTIONS = [
  { id: "hex", label: "HEX", desc: "Hexadecimal string" },
  { id: "base64", label: "BASE64", desc: "Base64 encoded" },
  { id: "base64url", label: "BASE64URL", desc: "URL-safe Base64" },
];

const HashGenerator = () => {
  const [activeTab, setActiveTab] = useState("text"); // "text" | "file" | "verify"
  const [result, setResult] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [fileResult, setFileResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const fileRef = useRef(null);

  // Text tab state
  const [inputText, setInputText] = useState("");
  const [selectedAlgs, setSelectedAlgs] = useState(new Set(DEFAULT_SELECTED));
  const [encoding, setEncoding] = useState("hex");
  const [useHmac, setUseHmac] = useState(false);
  const [hmacSecret, setHmacSecret] = useState("");

  // Verify tab state
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyHash, setVerifyHashVal] = useState("");
  const [verifyAlg, setVerifyAlg] = useState("sha256");
  const [verifyEncoding, setVerifyEncoding] = useState("hex");
  const [verifyUseHmac, setVerifyUseHmac] = useState(false);
  const [verifyHmacSecret, setVerifyHmacSecret] = useState("");

  // File tab state
  const [dragOver, setDragOver] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileAlgs, setFileAlgs] = useState(new Set(DEFAULT_SELECTED));

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleAlg = (alg, setter) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(alg)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(alg);
      } else {
        next.add(alg);
      }
      return next;
    });
  };

  // ── TEXT HASH ──
  const handleGenerate = async () => {
    setError(null);
    if (!inputText.trim()) {
      setError("Input text is required");
      return;
    }
    if (useHmac && !hmacSecret.trim()) {
      setError("HMAC secret is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/hash-generator`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: inputText,
            algorithms: [...selectedAlgs],
            encoding,
            useHmac,
            hmacSecret,
          }),
        },
      );
      const data = await res.json();
      if (data.success) setResult(data.data);
      else setError(data.message || "Failed to generate hash");
    } catch {
      setError("Failed to generate hash. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── VERIFY ──
  const handleVerify = async () => {
    setError(null);
    if (!verifyInput.trim() || !verifyHash.trim()) {
      setError("Input text and hash are required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/hash-verifier`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: verifyInput,
            hash: verifyHash,
            algorithm: verifyAlg,
            encoding: verifyEncoding,
            useHmac: verifyUseHmac,
            hmacSecret: verifyHmacSecret,
          }),
        },
      );
      const data = await res.json();
      if (data.success) setVerifyResult(data.data);
      else setError(data.message || "Failed to verify hash");
    } catch {
      setError("Failed to verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── FILE HASH ──
  const handleFile = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tools/hash-file`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileBase64: base64,
              fileName: file.name,
              algorithms: [...fileAlgs],
              encoding: "hex",
            }),
          },
        );
        const data = await res.json();
        if (data.success) setFileResult(data.data);
        else setError(data.message || "Failed to hash file");
      } catch {
        setError("Failed to hash file.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const getAlgBadgeColor = (alg) => {
    if (["md5", "sha1"].includes(alg))
      return "text-orange-600 bg-orange-50 border-orange-200";
    if (alg.startsWith("sha3") || alg.startsWith("blake"))
      return "text-green-600 bg-green-50 border-green-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const AlgorithmSelector = ({ selected, setSelected }) => (
    <div className="grid grid-cols-2 gap-2">
      {ALL_ALGORITHMS.map((alg) => (
        <button
          key={alg.id}
          onClick={() => toggleAlg(alg.id, setSelected)}
          className={`text-left px-3 py-2.5 rounded-lg border transition-all duration-150 ${
            selected.has(alg.id)
              ? "bg-blue-50 border-blue-300"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.has(alg.id)}
              onChange={() => toggleAlg(alg.id, setSelected)}
              className="w-3.5 h-3.5 accent-blue-600"
            />
            <span className="text-xs font-bold text-gray-800">{alg.label}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-5">{alg.bits}-bit</p>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <Hash className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hash Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate cryptographic hashes from text or files. Supports MD5, SHA
            family, SHA-3, BLAKE2, RIPEMD-160, and HMAC variants.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1">
            {[
              { id: "text", label: "📝 Text Hash" },
              { id: "file", label: "📁 File Hash" },
              { id: "verify", label: "✅ Verify Hash" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError(null);
                }}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* ══════════ TEXT TAB ══════════ */}
        {activeTab === "text" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>⚙️</span> Options
                </h2>

                {/* Algorithms */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    Algorithms
                  </label>
                  <AlgorithmSelector
                    selected={selectedAlgs}
                    setSelected={setSelectedAlgs}
                  />
                </div>

                {/* Encoding */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    Output Encoding
                  </label>
                  <div className="space-y-2">
                    {ENCODING_OPTIONS.map((enc) => (
                      <button
                        key={enc.id}
                        onClick={() => setEncoding(enc.id)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all ${
                          encoding === enc.id
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={encoding === enc.id}
                          onChange={() => setEncoding(enc.id)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {enc.label}
                          </p>
                          <p className="text-xs text-gray-500">{enc.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* HMAC Toggle */}
                <div>
                  <button
                    onClick={() => setUseHmac((v) => !v)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                      useHmac
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={useHmac}
                      onChange={() => setUseHmac((v) => !v)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        HMAC Mode
                      </p>
                      <p className="text-xs text-gray-500">
                        Keyed-hash message auth
                      </p>
                    </div>
                  </button>

                  {useHmac && (
                    <input
                      type="text"
                      value={hmacSecret}
                      onChange={(e) => setHmacSecret(e.target.value)}
                      placeholder="HMAC secret key"
                      className="w-full mt-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Hashing...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Generate Hashes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📝</span> Input Text
                </h3>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={5}
                  placeholder="Enter text to hash..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{inputText.length} characters</span>
                  <span>{new Blob([inputText]).size} bytes</span>
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      Generated Hashes
                    </h3>
                    <button
                      onClick={() => {
                        const text = Object.entries(result.hashes)
                          .map(([alg, hash]) => `${alg.toUpperCase()}: ${hash}`)
                          .join("\n");
                        copyToClipboard(text, "all");
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        copied === "all"
                          ? "bg-green-50 text-green-700 border-green-300"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {copied === "all" ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copied === "all" ? "Copied All!" : "Copy All"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(result.hashes).map(([alg, hash]) => {
                      const meta = ALL_ALGORITHMS.find((a) => a.id === alg);
                      return (
                        <div
                          key={alg}
                          className="bg-white border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getAlgBadgeColor(alg)}`}
                              >
                                {meta?.label || alg.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-400">
                                {meta?.bits}-bit • {meta?.note}
                              </span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(hash, alg)}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                copied === alg
                                  ? "bg-green-50 text-green-700 border-green-300"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              {copied === alg ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              {copied === alg ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <p className="font-mono text-sm text-gray-800 break-all bg-gray-50 px-3 py-2 rounded-lg">
                            {hash}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Metadata */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <Info className="w-4 h-4 inline mr-2" />
                      Input: <strong>{result.input.length} chars</strong> •{" "}
                      <strong>{result.input.bytes} bytes</strong> • Encoding:{" "}
                      <strong>{result.encoding.toUpperCase()}</strong>
                      {result.useHmac && (
                        <span>
                          {" "}
                          • <strong>HMAC</strong> enabled
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {!result && !loading && (
                <div className="flex items-center justify-center h-64 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <Hash className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Enter text and generate hashes
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supports 11 algorithms with HMAC mode
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ FILE TAB ══════════ */}
        {activeTab === "file" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>⚙️</span> Algorithms
                </h2>
                <AlgorithmSelector
                  selected={fileAlgs}
                  setSelected={setFileAlgs}
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    Max file size: <strong>10 MB</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Output encoding: <strong>HEX</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* File Drop + Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30"
                }`}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 font-semibold">
                  Drop a file here or click to browse
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Any file type • Max 10MB
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) handleFile(e.target.files[0]);
                  }}
                />
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center h-32 bg-white border border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    Hashing file...
                  </div>
                </div>
              )}

              {/* File Results */}
              {fileResult && !loading && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                      <span className="text-lg">📄</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {fileResult.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {fileResult.file.sizeFormatted}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(fileResult.hashes).map(([alg, hash]) => {
                      const meta = ALL_ALGORITHMS.find((a) => a.id === alg);
                      return (
                        <div
                          key={alg}
                          className="bg-white border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getAlgBadgeColor(alg)}`}
                              >
                                {meta?.label || alg.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-400">
                                {meta?.bits}-bit
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(hash, `file-${alg}`)
                              }
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                copied === `file-${alg}`
                                  ? "bg-green-50 text-green-700 border-green-300"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              {copied === `file-${alg}` ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              {copied === `file-${alg}` ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <p className="font-mono text-sm text-gray-800 break-all bg-gray-50 px-3 py-2 rounded-lg">
                            {hash}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ VERIFY TAB ══════════ */}
        {activeTab === "verify" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>⚙️</span> Options
                </h2>

                {/* Algorithm selector (single) */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    Algorithm
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {ALL_ALGORITHMS.map((alg) => (
                      <button
                        key={alg.id}
                        onClick={() => setVerifyAlg(alg.id)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all ${
                          verifyAlg === alg.id
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={verifyAlg === alg.id}
                          onChange={() => setVerifyAlg(alg.id)}
                          className="w-3.5 h-3.5 accent-blue-600"
                        />
                        <span className="font-semibold text-gray-800">
                          {alg.label}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {alg.bits}b
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Encoding */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Hash Encoding
                  </label>
                  <div className="space-y-2">
                    {ENCODING_OPTIONS.map((enc) => (
                      <button
                        key={enc.id}
                        onClick={() => setVerifyEncoding(enc.id)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all ${
                          verifyEncoding === enc.id
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={verifyEncoding === enc.id}
                          onChange={() => setVerifyEncoding(enc.id)}
                          className="w-3.5 h-3.5 accent-blue-600"
                        />
                        <span className="font-semibold text-gray-800">
                          {enc.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* HMAC */}
                <div>
                  <button
                    onClick={() => setVerifyUseHmac((v) => !v)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all ${
                      verifyUseHmac
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={verifyUseHmac}
                      onChange={() => setVerifyUseHmac((v) => !v)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm font-semibold text-gray-800">
                      HMAC Mode
                    </span>
                  </button>
                  {verifyUseHmac && (
                    <input
                      type="text"
                      value={verifyHmacSecret}
                      onChange={(e) => setVerifyHmacSecret(e.target.value)}
                      placeholder="HMAC secret key"
                      className="w-full mt-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  )}
                </div>

                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Verify Hash
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verify Inputs + Result */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Input Text</h3>
                <textarea
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  rows={4}
                  placeholder="Enter the original text..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />

                <h3 className="text-lg font-bold text-gray-900">Known Hash</h3>
                <input
                  type="text"
                  value={verifyHash}
                  onChange={(e) => setVerifyHashVal(e.target.value)}
                  placeholder="Paste hash to compare against..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Verify Result */}
              {verifyResult && (
                <div
                  className={`rounded-2xl p-6 border-2 ${
                    verifyResult.match
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {verifyResult.match ? (
                      <ShieldCheck className="w-8 h-8 text-green-600" />
                    ) : (
                      <ShieldX className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <p
                        className={`text-xl font-bold ${verifyResult.match ? "text-green-800" : "text-red-800"}`}
                      >
                        {verifyResult.match ? "Hash Matched!" : "Hash Mismatch"}
                      </p>
                      <p
                        className={`text-sm ${verifyResult.match ? "text-green-600" : "text-red-600"}`}
                      >
                        {verifyResult.match
                          ? "The input text matches the provided hash."
                          : "The input text does not match the provided hash."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Computed Hash
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs text-gray-800 break-all bg-white px-3 py-2 rounded-lg flex-1 border border-gray-200">
                          {verifyResult.computedHash}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              verifyResult.computedHash,
                              "computed",
                            )
                          }
                          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-blue-300 transition-all flex-shrink-0"
                        >
                          {copied === "computed" ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Provided Hash
                      </p>
                      <p className="font-mono text-xs text-gray-800 break-all bg-white px-3 py-2 rounded-lg border border-gray-200">
                        {verifyResult.providedHash}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Algorithm:{" "}
                      <strong>{verifyResult.algorithm.toUpperCase()}</strong> •
                      Encoding:{" "}
                      <strong>{verifyResult.encoding.toUpperCase()}</strong>
                    </p>
                  </div>
                </div>
              )}

              {!verifyResult && !loading && (
                <div className="flex items-center justify-center h-48 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">
                      Enter text and a known hash to verify
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

export default HashGenerator;

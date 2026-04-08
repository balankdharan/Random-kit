import { useState } from "react";
import { Copy, Download, AlertCircle, RotateCcw } from "lucide-react";
import ToolNavbar from "../components/ToolNavbar";

const QRCodeGenerator = () => {
  const [qrCode, setQrCode] = useState(null);
  const [batchQRCodes, setBatchQRCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [copied, setCopied] = useState(null);
  const [activeTab, setActiveTab] = useState("single");

  // Single QR options
  const [singleOptions, setSingleOptions] = useState({
    text: "https://example.com",
    size: 300,
    errorCorrection: "M",
    margin: 4,
    color: "#000000",
    backgroundColor: "#FFFFFF",
  });

  // Batch QR options
  const [batchOptions, setBatchOptions] = useState({
    texts: "https://example.com\nhttps://github.com\nhttps://google.com",
    size: 200,
    errorCorrection: "M",
  });

  // Update single option
  const updateSingleOption = (optionName, value) => {
    setSingleOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Update batch option
  const updateBatchOption = (optionName, value) => {
    setBatchOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Generate single QR code
  const handleGenerateSingle = async () => {
    if (!singleOptions.text.trim()) {
      setError("Enter text to generate QR code");
      return;
    }

    if (singleOptions.text.length > 2953) {
      setError("Text is too long (max 2953 characters)");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/qr-generator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(singleOptions),
        },
      );

      const data = await response.json();

      if (data.success) {
        setQrCode(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to generate QR code");
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate batch QR codes
  const handleGenerateBatch = async () => {
    const texts = batchOptions.texts
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (texts.length === 0) {
      setError("Enter at least one text");
      return;
    }

    if (texts.length > 50) {
      setError("Maximum 50 QR codes at once");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/qr-generator-batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texts,
            size: singleOptions.size,
            errorCorrection: singleOptions.errorCorrection,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setBatchQRCodes(data.data.qrCodes);
        setError(null);
      } else {
        setError(data.message || "Failed to generate QR codes");
      }
    } catch (err) {
      console.error("Error generating QR codes:", err);
      setError("Failed to generate QR codes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Download QR code
  const downloadQRCode = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename || "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to clipboard
  // const copyToClipboard = (text, id) => {
  //   navigator.clipboard.writeText(text);
  //   setCopied(id);
  //   setTimeout(() => setCopied(null), 2000);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <span className="text-3xl">📱</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            QR Code Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate customizable QR codes. Support for single and batch
            generation with various error correction levels.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3 max-w-6xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto mb-8 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("single")}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === "single"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Single QR Code
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === "batch"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Batch Generation
          </button>
        </div>

        {/* Single QR Code Tab */}
        {activeTab === "single" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>⚙️</span> Configuration
                </h2>

                {/* Text Input */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Text/URL
                  </label>
                  <textarea
                    value={singleOptions.text}
                    onChange={(e) => updateSingleOption("text", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-mono"
                    rows="4"
                    placeholder="Enter text or URL..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {singleOptions.text.length}/2953 characters
                  </p>
                </div>

                {/* Size */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Size:{" "}
                    <span className="text-blue-600">
                      {singleOptions.size}px
                    </span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={singleOptions.size}
                    onChange={(e) =>
                      updateSingleOption("size", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Error Correction */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    Error Correction
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "L", label: "Low (7%)", desc: "7% recovery" },
                      {
                        value: "M",
                        label: "Medium (15%)",
                        desc: "15% recovery",
                      },
                      {
                        value: "Q",
                        label: "Quartile (25%)",
                        desc: "25% recovery",
                      },
                      { value: "H", label: "High (30%)", desc: "30% recovery" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          updateSingleOption("errorCorrection", option.value)
                        }
                        className={`px-3 py-2 rounded-lg transition-all border text-xs font-medium ${
                          singleOptions.errorCorrection === option.value
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                        title={option.desc}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      QR Code Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={singleOptions.color}
                        onChange={(e) =>
                          updateSingleOption("color", e.target.value)
                        }
                        className="w-12 h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={singleOptions.color}
                        onChange={(e) =>
                          updateSingleOption("color", e.target.value)
                        }
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={singleOptions.backgroundColor}
                        onChange={(e) =>
                          updateSingleOption("backgroundColor", e.target.value)
                        }
                        className="w-12 h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={singleOptions.backgroundColor}
                        onChange={(e) =>
                          updateSingleOption("backgroundColor", e.target.value)
                        }
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Margin */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Margin:{" "}
                    <span className="text-blue-600">
                      {singleOptions.margin}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={singleOptions.margin}
                    onChange={(e) =>
                      updateSingleOption("margin", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateSingle}
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
                      Generate QR Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {qrCode && (
                <div className="space-y-6">
                  {/* QR Code Preview */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex justify-center">
                    <img
                      src={qrCode.qrCode}
                      alt="Generated QR Code"
                      className="max-w-sm border border-gray-200 rounded-lg"
                    />
                  </div>

                  {/* QR Code Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      QR Code Info
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-xs font-semibold text-gray-600">
                          Version
                        </p>
                        <p className="text-sm font-mono text-gray-900">
                          {qrCode.info.version}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-xs font-semibold text-gray-600">
                          Modules
                        </p>
                        <p className="text-sm font-mono text-gray-900">
                          {qrCode.info.modules}x{qrCode.info.modules}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-xs font-semibold text-gray-600">
                          Error Correction
                        </p>
                        <p className="text-sm font-mono text-gray-900">
                          {qrCode.errorCorrection}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-xs font-semibold text-gray-600">
                          Data Capacity
                        </p>
                        <p className="text-sm font-mono text-gray-900">
                          {qrCode.info.dataCapacity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Download Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        downloadQRCode(qrCode.qrCode, "qr-code.png")
                      }
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG
                    </button>
                  </div>
                </div>
              )}

              {!qrCode && !loading && (
                <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl mb-4">📱</div>
                    <p className="text-gray-600">
                      Generate a QR code to see preview
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Customize colors, size, and error correction level
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Batch QR Code Tab */}
        {activeTab === "batch" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>⚙️</span> Batch Settings
                </h2>

                {/* Texts Input */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Texts (One per line)
                  </label>
                  <textarea
                    value={batchOptions.texts}
                    onChange={(e) => updateBatchOption("texts", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-mono"
                    rows="8"
                    placeholder="Enter one text/URL per line..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {
                      batchOptions.texts
                        .split("\n")
                        .filter((t) => t.trim().length > 0).length
                    }
                    /50 entries
                  </p>
                </div>

                {/* Size */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Size:{" "}
                    <span className="text-blue-600">
                      {singleOptions.size}px
                    </span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    step="50"
                    value={singleOptions.size}
                    onChange={(e) =>
                      updateSingleOption("size", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateBatch}
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
                      Generate All
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {batchQRCodes.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Generated QR Codes ({batchQRCodes.length})
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {batchQRCodes.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="aspect-square bg-gray-50 p-3 flex items-center justify-center">
                          <img
                            src={item.qrCode}
                            alt={`QR Code ${idx + 1}`}
                            className="max-w-full max-h-full"
                          />
                        </div>
                        <div className="p-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-600 truncate">
                            QR #{idx + 1}
                          </p>
                          <p
                            className="text-xs text-gray-600 truncate"
                            title={item.text}
                          >
                            {item.text.substring(0, 20)}...
                          </p>
                          <button
                            onClick={() =>
                              downloadQRCode(
                                item.qrCode,
                                `qr-code-${idx + 1}.png`,
                              )
                            }
                            className="w-full px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs font-medium transition-all"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {batchQRCodes.length === 0 && !loading && (
                <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl mb-4">📱</div>
                    <p className="text-gray-600">Generate batch QR codes</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Create up to 50 QR codes at once
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

export default QRCodeGenerator;

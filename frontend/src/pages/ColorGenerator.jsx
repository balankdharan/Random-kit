import { useState } from "react";
import { Copy, RotateCcw, Download, Check, AlertCircle } from "lucide-react";
import ToolNavbar from "../components/ToolNavbar";

const ColorGenerator = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [converterInput, setConverterInput] = useState("");
  const [converterResult, setConverterResult] = useState(null);
  const [converterLoading, setConverterLoading] = useState(false);
  const [paletteResult, setPaletteResult] = useState(null);

  // Generator options
  const [options, setOptions] = useState({
    quantity: 10,
    includeFormats: true,
  });

  // Palette options
  const [paletteOptions, setPaletteOptions] = useState({
    baseColor: "",
    paletteType: "monochromatic",
    count: 5,
  });

  // Update option
  const updateOption = (optionName, value) => {
    setOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Update palette option
  const updatePaletteOption = (optionName, value) => {
    setPaletteOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Generate colors
  const handleGenerate = async () => {
    if (options.quantity < 1 || options.quantity > 500) {
      setError("Quantity must be between 1 and 500");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/color-generator`,
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
        setColors(data.data.colors);
        setError(null);
      } else {
        setError(data.message || "Failed to generate colors");
      }
    } catch (err) {
      console.error("Error generating colors:", err);
      setError("Failed to generate colors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Convert color
  const handleConvertColor = async () => {
    if (!converterInput.trim()) {
      setError("Enter a color to convert");
      return;
    }

    try {
      setConverterLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/color-converter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ color: converterInput }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setConverterResult(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to convert color");
      }
    } catch (err) {
      console.error("Error converting color:", err);
      setError("Failed to convert color. Please try again.");
    } finally {
      setConverterLoading(false);
    }
  };

  // Generate palette
  const handleGeneratePalette = async () => {
    if (paletteOptions.count < 2 || paletteOptions.count > 20) {
      setError("Palette count must be between 2 and 20");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tools/color-palette`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paletteOptions),
        },
      );

      const data = await response.json();

      if (data.success) {
        setPaletteResult(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to generate palette");
      }
    } catch (err) {
      console.error("Error generating palette:", err);
      setError("Failed to generate palette. Please try again.");
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

  // Download colors as JSON
  const downloadColorsJSON = () => {
    const text = JSON.stringify(colors, null, 2);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", "colors.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white pt-20">
      <ToolNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-sm border border-blue-200">
            <span className="text-3xl">🎨</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Color Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate random colors, convert formats, and create color palettes.
            Support for HEX, RGB, and HSL.
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
              {/* Color Converter */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🔄</span> Converter
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-xs text-blue-800">
                    Convert colors between HEX, RGB, and HSL formats.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Color Input
                    </label>
                    <input
                      type="text"
                      value={converterInput}
                      onChange={(e) => setConverterInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleConvertColor()
                      }
                      placeholder="#FF5733 or rgb(255,87,51)"
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    />
                  </div>

                  <button
                    onClick={handleConvertColor}
                    disabled={converterLoading || !converterInput.trim()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {converterLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Convert
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200"></div>

              {/* Color Palette Generator */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🎭</span> Palette
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Base Color (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={paletteOptions.baseColor || "#0066FF"}
                        onChange={(e) =>
                          updatePaletteOption("baseColor", e.target.value)
                        }
                        className="w-12 h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={paletteOptions.baseColor}
                        onChange={(e) =>
                          updatePaletteOption("baseColor", e.target.value)
                        }
                        placeholder="Leave empty for random"
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                      Palette Type
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          value: "monochromatic",
                          label: "Monochromatic",
                          desc: "Shades of one color",
                        },
                        {
                          value: "analogous",
                          label: "Analogous",
                          desc: "Similar colors",
                        },
                        {
                          value: "complementary",
                          label: "Complementary",
                          desc: "Opposite colors",
                        },
                        {
                          value: "triadic",
                          label: "Triadic",
                          desc: "Three colors",
                        },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() =>
                            updatePaletteOption("paletteType", type.value)
                          }
                          className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 border text-sm ${
                            paletteOptions.paletteType === type.value
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paletteType"
                            value={type.value}
                            checked={paletteOptions.paletteType === type.value}
                            onChange={() =>
                              updatePaletteOption("paletteType", type.value)
                            }
                            className="w-4 h-4 mt-1 cursor-pointer accent-blue-600"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {type.label}
                            </p>
                            <p className="text-xs text-gray-600">{type.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                      Count:{" "}
                      <span className="text-blue-600">
                        {paletteOptions.count}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={paletteOptions.count}
                      onChange={(e) =>
                        updatePaletteOption("count", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <button
                    onClick={handleGeneratePalette}
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
                        Generate Palette
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200"></div>

              {/* Color Generator */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>⚙️</span> Generator
                </h2>

                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                    Quantity:{" "}
                    <span className="text-blue-600">{options.quantity}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={options.quantity}
                    onChange={(e) =>
                      updateOption("quantity", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>1</span>
                    <span>500</span>
                  </div>
                </div>

                <div className="mb-8">
                  <button
                    onClick={() =>
                      updateOption("includeFormats", !options.includeFormats)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                      options.includeFormats
                        ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={options.includeFormats}
                      onChange={() =>
                        updateOption("includeFormats", !options.includeFormats)
                      }
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Include All Formats
                    </span>
                  </button>
                </div>

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
                      Generate Colors
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Converter Results */}
            {converterResult && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Color Conversion
                </h3>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Color Preview */}
                  <div
                    className="h-32 w-full border-b border-gray-200"
                    style={{ backgroundColor: converterResult.hex }}
                  />

                  {/* Color Values */}
                  <div className="p-6 space-y-3">
                    {[
                      { label: "HEX", value: converterResult.hex, icon: "#" },
                      { label: "RGB", value: converterResult.rgb, icon: "📍" },
                      {
                        label: "RGBA",
                        value: converterResult.rgba,
                        icon: "📍",
                      },
                      { label: "HSL", value: converterResult.hsl, icon: "🎨" },
                      {
                        label: "HSLA",
                        value: converterResult.hsla,
                        icon: "🎨",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                      >
                        <div>
                          <p className="text-xs font-semibold text-gray-600">
                            {item.label}
                          </p>
                          <code className="text-sm text-gray-900 font-mono">
                            {item.value}
                          </code>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(item.value, `convert-${item.label}`)
                          }
                          className={`p-2 rounded transition-all ${
                            copied === `convert-${item.label}`
                              ? "bg-green-100 text-green-700"
                              : "hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Complementary Color */}
                    {converterResult.complementary && (
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          COMPLEMENTARY COLOR
                        </p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-16 h-16 rounded-lg border border-gray-200"
                            style={{
                              backgroundColor: converterResult.complementary,
                            }}
                          />
                          <code className="text-sm text-gray-900 font-mono">
                            {converterResult.complementary}
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                converterResult.complementary,
                                "complementary",
                              )
                            }
                            className={`p-2 rounded transition-all ${
                              copied === "complementary"
                                ? "bg-green-100 text-green-700"
                                : "hover:bg-gray-200 text-gray-600"
                            }`}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Palette Results */}
            {paletteResult && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {paletteResult.paletteType} Palette
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paletteResult.palette.map((color, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div
                        className="h-24 w-full"
                        style={{ backgroundColor: color.hex || color.hsl }}
                      />
                      <div className="p-3 space-y-2">
                        {color.role && (
                          <p className="text-xs font-semibold text-gray-600">
                            {color.role}
                          </p>
                        )}
                        {color.type && (
                          <p className="text-xs font-semibold text-gray-600">
                            {color.type}
                          </p>
                        )}
                        <code className="text-sm text-gray-900 font-mono block">
                          {color.hex || color.hsl}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              color.hex || color.hsl,
                              `palette-${idx}`,
                            )
                          }
                          className={`w-full py-2 rounded text-xs font-medium transition-all ${
                            copied === `palette-${idx}`
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {copied === `palette-${idx}` ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Colors */}
            {colors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Generated Colors
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {colors.length} random color
                      {colors.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={downloadColorsJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all hover:shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => copyToClipboard(color.hex, `color-${idx}`)}
                    >
                      <div
                        className="h-20 w-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="p-2">
                        <code className="text-xs text-gray-900 font-mono block text-center">
                          {color.hex}
                        </code>
                        {copied === `color-${idx}` && (
                          <p className="text-xs text-green-600 mt-1 text-center">
                            ✓ Copied
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {colors.length === 0 &&
              !converterResult &&
              !paletteResult &&
              !loading && (
                <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🎨</div>
                    <p className="text-gray-600">
                      Generate colors or create palettes
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Convert between HEX, RGB, and HSL formats
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

export default ColorGenerator;

import crypto from "crypto";

/**
 * Generate random color in HEX format
 */
const generateHexColor = () => {
  const randomColor = crypto.randomInt(0, 0xffffff);
  return `#${randomColor.toString(16).padStart(6, "0").toUpperCase()}`;
};

/**
 * Convert HEX to RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * RGB to HEX
 */
const rgbToHex = (r, g, b) => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
};

/**
 * Convert RGB to HSL
 */
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/**
 * Get complementary color
 */
const getComplementaryColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const complementaryHue = (hsl.h + 180) % 360;

  // Convert back to RGB (simplified)
  const c = (1 - Math.abs(2 * (hsl.l / 100) - 1)) * (hsl.s / 100);
  const x = c * (1 - Math.abs(((complementaryHue / 60) % 2) - 1));
  const m = hsl.l / 100 - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (complementaryHue >= 0 && complementaryHue < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (complementaryHue >= 60 && complementaryHue < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (complementaryHue >= 120 && complementaryHue < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (complementaryHue >= 180 && complementaryHue < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (complementaryHue >= 240 && complementaryHue < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return rgbToHex(r, g, b);
};

/**
 * Generate color details
 */
const generateColorDetails = (hex) => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const complementary = getComplementaryColor(hex);

  return {
    hex: hex,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
    rgbValues: rgb,
    hslValues: hsl,
    complementary: complementary,
  };
};

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);

  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

/**
 * Generate random colors
 */
export const generateColors = (req, res) => {
  try {
    const { quantity = 1, includeFormats = true } = req.body;

    // Validation
    if (quantity < 1 || quantity > 500) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 500",
      });
    }

    const colors = [];

    for (let i = 0; i < quantity; i++) {
      const hex = generateHexColor();
      const colorData = includeFormats
        ? generateColorDetails(hex)
        : { hex: hex };

      colors.push(colorData);
    }

    res.json({
      success: true,
      data: {
        colors,
        count: colors.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating colors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate colors",
      error: error.message,
    });
  }
};

/**
 * Convert color format
 */
export const convertColor = (req, res) => {
  try {
    const { color } = req.body;

    if (!color) {
      return res.status(400).json({
        success: false,
        message: "Color is required",
      });
    }

    // Try to parse color
    let hex;

    if (color.startsWith("#")) {
      hex = color.toUpperCase();
    } else if (color.toLowerCase().startsWith("rgb")) {
      // Parse RGB
      const match = color.match(/\d+/g);
      if (match && match.length >= 3) {
        hex = rgbToHex(
          parseInt(match[0]),
          parseInt(match[1]),
          parseInt(match[2]),
        );
      } else {
        throw new Error("Invalid RGB format");
      }
    } else {
      throw new Error("Unsupported color format");
    }

    // Validate hex
    if (!/^#[0-9A-F]{6}$/i.test(hex)) {
      throw new Error("Invalid color format");
    }

    const colorData = generateColorDetails(hex);

    res.json({
      success: true,
      data: colorData,
    });
  } catch (error) {
    console.error("Error converting color:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to convert color",
    });
  }
};

/**
 * Generate color palette
 */
export const generatePalette = (req, res) => {
  try {
    const {
      baseColor = null,
      paletteType = "monochromatic",
      count = 5,
    } = req.body;

    if (count < 2 || count > 20) {
      return res.status(400).json({
        success: false,
        message: "Count must be between 2 and 20",
      });
    }

    let baseHex = baseColor || generateHexColor();

    if (!baseHex.startsWith("#")) {
      baseHex = generateHexColor();
    }

    const rgb = hexToRgb(baseHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const palette = [];

    switch (paletteType) {
      case "monochromatic":
        for (let i = 0; i < count; i++) {
          const lightness = 10 + (i * 80) / (count - 1);

          const newH = hsl.h;
          const newS = hsl.s;
          const newL = lightness;

          const rgb = hslToRgb(newH, newS, newL);
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

          palette.push({
            hex: hex, // ✅ different hex now
            hsl: `hsl(${newH}, ${newS}%, ${newL}%)`,
            type: i === 0 ? "Dark" : i === count - 1 ? "Light" : "Medium",
          });
        }
        break;

      case "analogous":
        // Colors next to each other on color wheel
        for (let i = 0; i < count; i++) {
          const hue = (hsl.h + (i * 60) / (count - 1) - 30) % 360;
          palette.push({
            hex: `hsl(${hue}, ${hsl.s}%, ${hsl.l}%)`,
            hue: hue,
          });
        }
        break;

      case "complementary":
        // Base + complementary
        palette.push({ hex: baseHex, role: "Primary" });
        palette.push({
          hex: getComplementaryColor(baseHex),
          role: "Complementary",
        });
        break;

      case "triadic":
        // Three colors evenly spaced
        for (let i = 0; i < 3; i++) {
          const hue = (hsl.h + i * 120) % 360;
          palette.push({
            hex: `hsl(${hue}, ${hsl.s}%, ${hsl.l}%)`,
            role: ["Primary", "Secondary", "Tertiary"][i],
          });
        }
        break;

      default:
        palette.push({ hex: baseHex });
    }

    res.json({
      success: true,
      data: {
        baseColor: baseHex,
        paletteType,
        palette,
        count: palette.length,
      },
    });
  } catch (error) {
    console.error("Error generating palette:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate palette",
      error: error.message,
    });
  }
};

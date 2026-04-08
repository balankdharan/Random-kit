import QRCode from "qrcode";

/**
 * Generate QR code
 */
export const generateQRCode = async (req, res) => {
  try {
    const {
      text = "",
      size = 300,
      errorCorrection = "M",
      margin = 4,
      color = "#000000",
      backgroundColor = "#FFFFFF",
    } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    if (text.length > 2953) {
      return res.status(400).json({
        success: false,
        message: "Text is too long (max 2953 characters)",
      });
    }

    if (size < 100 || size > 1000) {
      return res.status(400).json({
        success: false,
        message: "Size must be between 100 and 1000",
      });
    }

    if (!["L", "M", "Q", "H"].includes(errorCorrection)) {
      return res.status(400).json({
        success: false,
        message: "Invalid error correction level",
      });
    }

    // Validate colors
    if (
      !/^#[0-9A-Fa-f]{6}$/.test(color) ||
      !/^#[0-9A-Fa-f]{6}$/.test(backgroundColor)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid color format. Use HEX colors (#RRGGBB)",
      });
    }

    // Generate QR code as data URL
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: margin,
      color: {
        dark: color,
        light: backgroundColor,
      },
      errorCorrectionLevel: errorCorrection,
    });

    // Get QR code size info
    const qrInfo = {
      version: getQRVersion(text.length, errorCorrection),
      modules: getModuleCount(getQRVersion(text.length, errorCorrection)),
      dataCapacity: getDataCapacity(getQRVersion(text.length, errorCorrection)),
    };

    res.json({
      success: true,
      data: {
        qrCode: dataUrl,
        text,
        size,
        errorCorrection,
        margin,
        color,
        backgroundColor,
        info: qrInfo,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate QR code",
      error: error.message,
    });
  }
};

/**
 * Get estimated QR version
 */
const getQRVersion = (textLength, errorCorrection) => {
  // Simplified version estimation
  const levels = {
    L: [41, 77, 127, 187, 255, 322, 370],
    M: [34, 63, 101, 149, 202, 255, 293],
    Q: [27, 48, 77, 111, 144, 178, 207],
    H: [17, 34, 58, 82, 106, 139, 154],
  };

  const capacity = levels[errorCorrection];
  for (let i = 0; i < capacity.length; i++) {
    if (textLength <= capacity[i]) {
      return i + 1;
    }
  }
  return 40; // Max version
};

/**
 * Get module count for version
 */
const getModuleCount = (version) => {
  return 4 * version + 17;
};

/**
 * Get data capacity
 */
const getDataCapacity = (version) => {
  const capacities = [
    41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250,
    1408, 1577, 1661, 1761, 1841, 2051, 2185, 2323, 2465, 2619, 2809, 2953,
  ];
  return capacities[Math.min(version - 1, capacities.length - 1)];
};

/**
 * Generate multiple QR codes
 */
export const generateMultipleQRCodes = async (req, res) => {
  try {
    const { texts = [], size = 300, errorCorrection = "M" } = req.body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Texts array is required and must not be empty",
      });
    }

    if (texts.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Maximum 50 QR codes at once",
      });
    }

    const qrCodes = [];

    for (const text of texts) {
      if (!text || text.trim().length === 0) {
        continue;
      }

      try {
        const dataUrl = await QRCode.toDataURL(text, {
          width: size,
          margin: 4,
          errorCorrectionLevel: errorCorrection,
        });

        qrCodes.push({
          text,
          qrCode: dataUrl,
        });
      } catch (err) {
        // Skip failed QR codes
        continue;
      }
    }

    res.json({
      success: true,
      data: {
        qrCodes,
        count: qrCodes.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating multiple QR codes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate QR codes",
      error: error.message,
    });
  }
};

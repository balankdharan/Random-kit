import {
  v1 as uuidv1,
  v4 as uuidv4,
  v5 as uuidv5,
  validate as uuidValidate,
} from "uuid";

/**
 * Generate UUIDs with different versions
 * @param {object} options - Generation options
 * @returns {Array} - Generated UUIDs
 */
export const generateUUIDs = (req, res) => {
  try {
    const {
      version = "v4",
      quantity = 1,
      format = "standard",
      uppercase = false,
      namespace = null,
      name = null,
    } = req.body;

    // Validation
    if (!["v1", "v4", "v5"].includes(version)) {
      return res.status(400).json({
        success: false,
        message: "Invalid UUID version. Use v1, v4, or v5",
      });
    }

    if (quantity < 1 || quantity > 100) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 100",
      });
    }

    if (!["standard", "no-hyphens", "braces", "urn"].includes(format)) {
      return res.status(400).json({
        success: false,
        message: "Invalid format. Use standard, no-hyphens, braces, or urn",
      });
    }

    // V5 requires namespace and name
    if (version === "v5" && (!namespace || !name)) {
      return res.status(400).json({
        success: false,
        message: "V5 UUID requires namespace and name",
      });
    }

    const uuids = [];

    // Generate UUIDs based on version
    for (let i = 0; i < quantity; i++) {
      let uuid;

      if (version === "v1") {
        uuid = uuidv1();
      } else if (version === "v4") {
        uuid = uuidv4();
      } else if (version === "v5") {
        // V5 uses namespace (DNS, URL, OID, X500) and name
        uuid = uuidv5(name, namespace);
      }

      // Apply format
      let formatted = formatUUID(uuid, format);

      // Apply case
      if (uppercase) {
        formatted = formatted.toUpperCase();
      }

      uuids.push({
        uuid: formatted,
        version,
        format,
      });
    }

    res.json({
      success: true,
      data: {
        uuids,
        count: uuids.length,
        version,
        format,
        uppercase,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating UUIDs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate UUIDs",
      error: error.message,
    });
  }
};

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {object} - Validation result
 */
export const validateUUID = (req, res) => {
  try {
    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({
        success: false,
        message: "UUID is required",
      });
    }

    // Validate UUID
    const isValid = uuidValidate(uuid);

    if (!isValid) {
      return res.json({
        success: true,
        data: {
          uuid,
          isValid: false,
          message: "Invalid UUID format",
        },
      });
    }

    // Parse UUID to get version
    const uuidParts = uuid.replace(/-/g, "");
    const versionBit = parseInt(uuidParts[12], 16);
    const variantBits = parseInt(uuidParts[16], 16);

    let version = "unknown";
    if (versionBit >> 2 === 1) version = "v1";
    else if (versionBit >> 2 === 4) version = "v4";
    else if (versionBit >> 2 === 5) version = "v5";

    // Analyze UUID
    const analysis = {
      isValid: true,
      version,
      length: uuid.length,
      format: detectFormat(uuid),
      components: parseUUID(uuid),
    };

    res.json({
      success: true,
      data: {
        uuid,
        ...analysis,
      },
    });
  } catch (error) {
    console.error("Error validating UUID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate UUID",
      error: error.message,
    });
  }
};

/**
 * Format UUID to different formats
 */
const formatUUID = (uuid, format) => {
  const standard = uuid.toLowerCase();

  switch (format) {
    case "standard":
      return standard;
    case "no-hyphens":
      return standard.replace(/-/g, "");
    case "braces":
      return `{${standard}}`;
    case "urn":
      return `urn:uuid:${standard}`;
    default:
      return standard;
  }
};

/**
 * Detect UUID format
 */
const detectFormat = (uuid) => {
  if (uuid.startsWith("urn:uuid:")) return "urn";
  if (uuid.startsWith("{") && uuid.endsWith("}")) return "braces";
  if (uuid.includes("-")) return "standard";
  return "no-hyphens";
};

/**
 * Parse UUID into components
 */
const parseUUID = (uuid) => {
  const cleaned = uuid.replace(/[-{}urn:uuid]/g, "");

  return {
    timeLow: cleaned.substring(0, 8),
    timeMid: cleaned.substring(8, 12),
    timeHiVersion: cleaned.substring(12, 16),
    clockSeqVariant: cleaned.substring(16, 20),
    node: cleaned.substring(20, 32),
  };
};

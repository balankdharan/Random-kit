import crypto from "crypto";

/**
 * Generate hash from input text
 */
export const generateHash = (req, res) => {
  try {
    const {
      text = "",
      algorithm = "sha256",
      encoding = "hex", // hex | base64
      salt = "",
      iterations = 1,
    } = req.body;

    const supportedAlgorithms = ["md5", "sha1", "sha256", "sha384", "sha512"];

    if (!text || text.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Input text is required",
      });
    }

    if (!supportedAlgorithms.includes(algorithm)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported algorithm. Use one of: ${supportedAlgorithms.join(", ")}`,
      });
    }

    if (!["hex", "base64"].includes(encoding)) {
      return res.status(400).json({
        success: false,
        message: "Encoding must be either 'hex' or 'base64'",
      });
    }

    if (iterations < 1 || iterations > 10000) {
      return res.status(400).json({
        success: false,
        message: "Iterations must be between 1 and 10000",
      });
    }

    let input = salt ? `${salt}${text}` : text;
    let hash = "";

    for (let i = 0; i < iterations; i++) {
      hash = crypto.createHash(algorithm).update(input).digest(encoding);
      input = hash;
    }

    res.json({
      success: true,
      data: {
        hash,
        algorithm,
        encoding,
        iterations,
        saltUsed: !!salt,
        inputLength: text.length,
        hashLength: hash.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating hash:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate hash",
      error: error.message,
    });
  }
};

/**
 * Compare text with hash
 */
export const verifyHash = (req, res) => {
  try {
    const {
      text = "",
      hash = "",
      algorithm = "sha256",
      encoding = "hex",
      salt = "",
      iterations = 1,
    } = req.body;

    if (!text || !hash) {
      return res.status(400).json({
        success: false,
        message: "Text and hash are required",
      });
    }

    let input = salt ? `${salt}${text}` : text;
    let generatedHash = "";

    for (let i = 0; i < iterations; i++) {
      generatedHash = crypto
        .createHash(algorithm)
        .update(input)
        .digest(encoding);
      input = generatedHash;
    }

    res.json({
      success: true,
      data: {
        match: generatedHash === hash,
        generatedHash,
        providedHash: hash,
      },
    });
  } catch (error) {
    console.error("Error verifying hash:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify hash",
      error: error.message,
    });
  }
};

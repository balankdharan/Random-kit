import crypto from "crypto";

/**
 * Generate hash from text input
 */
export const generateHash = (req, res) => {
  try {
    const {
      input = "",
      algorithms = ["md5", "sha1", "sha256", "sha512"],
      encoding = "hex",
      hmacSecret = "",
      useHmac = false,
    } = req.body;

    // Validation
    if (typeof input !== "string") {
      return res.status(400).json({
        success: false,
        message: "Input must be a string",
      });
    }

    if (input.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Input text is required",
      });
    }

    if (input.length > 100000) {
      return res.status(400).json({
        success: false,
        message: "Input too large. Max 100,000 characters",
      });
    }

    const supportedAlgorithms = [
      "md5",
      "sha1",
      "sha224",
      "sha256",
      "sha384",
      "sha512",
      "sha3-224",
      "sha3-256",
      "sha3-384",
      "sha3-512",
      "ripemd160",
      "blake2b512",
      "blake2s256",
    ];

    const supportedEncodings = ["hex", "base64", "base64url", "binary"];

    if (!Array.isArray(algorithms) || algorithms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one algorithm is required",
      });
    }

    const invalidAlgs = algorithms.filter(
      (a) => !supportedAlgorithms.includes(a),
    );
    if (invalidAlgs.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unsupported algorithm(s): ${invalidAlgs.join(", ")}`,
      });
    }

    if (!supportedEncodings.includes(encoding)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported encoding. Use: ${supportedEncodings.join(", ")}`,
      });
    }

    if (useHmac && (!hmacSecret || hmacSecret.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        message: "HMAC secret is required when HMAC mode is enabled",
      });
    }

    // Generate hashes
    const hashes = {};
    const errors = {};

    for (const alg of algorithms) {
      try {
        let hash;
        if (useHmac) {
          // HMAC not supported for blake2 variants
          if (alg.startsWith("blake2")) {
            errors[alg] = "HMAC not supported for BLAKE2 algorithms";
            continue;
          }
          hash = crypto
            .createHmac(alg, hmacSecret)
            .update(input, "utf8")
            .digest(encoding);
        } else {
          hash = crypto.createHash(alg).update(input, "utf8").digest(encoding);
        }
        hashes[alg] = hash;
      } catch (err) {
        errors[alg] = err.message;
      }
    }

    // Metadata
    const inputBytes = Buffer.byteLength(input, "utf8");

    res.json({
      success: true,
      data: {
        hashes,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        input: {
          length: input.length,
          bytes: inputBytes,
          preview: input.length > 100 ? input.slice(0, 100) + "..." : input,
        },
        encoding,
        useHmac,
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
 * Verify input matches a known hash
 */
export const verifyHash = (req, res) => {
  try {
    const {
      input = "",
      hash = "",
      algorithm = "sha256",
      encoding = "hex",
      hmacSecret = "",
      useHmac = false,
    } = req.body;

    if (!input || !hash || !algorithm) {
      return res.status(400).json({
        success: false,
        message: "Input, hash, and algorithm are required",
      });
    }

    if (useHmac && !hmacSecret) {
      return res.status(400).json({
        success: false,
        message: "HMAC secret is required",
      });
    }

    let computed;
    try {
      if (useHmac) {
        computed = crypto
          .createHmac(algorithm, hmacSecret)
          .update(input, "utf8")
          .digest(encoding);
      } else {
        computed = crypto
          .createHash(algorithm)
          .update(input, "utf8")
          .digest(encoding);
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `Invalid algorithm or encoding: ${err.message}`,
      });
    }

    // Constant-time comparison to prevent timing attacks
    const inputBuf = Buffer.from(hash.trim());
    const computedBuf = Buffer.from(computed);
    const match =
      inputBuf.length === computedBuf.length &&
      crypto.timingSafeEqual(inputBuf, computedBuf);

    res.json({
      success: true,
      data: {
        match,
        algorithm,
        encoding,
        computedHash: computed,
        providedHash: hash.trim(),
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

/**
 * Generate hash from file (base64 encoded content)
 */
export const generateFileHash = (req, res) => {
  try {
    const {
      fileBase64 = "",
      fileName = "file",
      algorithms = ["md5", "sha1", "sha256", "sha512"],
      encoding = "hex",
    } = req.body;

    if (!fileBase64) {
      return res.status(400).json({
        success: false,
        message: "File content (base64) is required",
      });
    }

    let fileBuffer;
    try {
      fileBuffer = Buffer.from(fileBase64, "base64");
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid base64 file content",
      });
    }

    if (fileBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File too large. Max 10MB",
      });
    }

    const hashes = {};
    for (const alg of algorithms) {
      try {
        hashes[alg] = crypto
          .createHash(alg)
          .update(fileBuffer)
          .digest(encoding);
      } catch (err) {
        hashes[alg] = `Error: ${err.message}`;
      }
    }

    res.json({
      success: true,
      data: {
        hashes,
        file: {
          name: fileName,
          size: fileBuffer.length,
          sizeFormatted: formatBytes(fileBuffer.length),
        },
        encoding,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error hashing file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to hash file",
      error: error.message,
    });
  }
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

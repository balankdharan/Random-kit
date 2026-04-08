import crypto from "crypto";

/**
 * Base64URL encode
 */
const base64UrlEncode = (str) => {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

/**
 * Base64URL decode
 */
const base64UrlDecode = (str) => {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("Invalid base64url string");
  }
  return Buffer.from(output, "base64").toString();
};

/**
 * HMAC SHA256 signature
 */
const createSignature = (message, secret, algorithm = "HS256") => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return base64UrlEncode(hmac.digest());
};

/**
 * Generate JWT token
 */
export const generateJWT = (req, res) => {
  try {
    const {
      payload = {},
      secret = "your-secret-key",
      algorithm = "HS256",
      expiresIn = 3600,
    } = req.body;

    // Validation
    if (!secret || secret.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Secret must be at least 8 characters",
      });
    }

    // Header
    const header = {
      alg: algorithm,
      typ: "JWT",
    };

    // Payload with claims
    const now = Math.floor(Date.now() / 1000);
    const claims = {
      iat: now,
      exp: now + expiresIn,
      ...payload,
    };

    // Encode header and payload
    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(claims));

    // Create signature
    const message = `${headerEncoded}.${payloadEncoded}`;
    const signature = createSignature(message, secret, algorithm);

    // Create JWT
    const token = `${message}.${signature}`;

    res.json({
      success: true,
      data: {
        token,
        header,
        payload: claims,
        expiresIn,
        expiresAt: new Date((now + expiresIn) * 1000).toISOString(),
        algorithm,
      },
    });
  } catch (error) {
    console.error("Error generating JWT:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate JWT",
      error: error.message,
    });
  }
};

/**
 * Decode and verify JWT token
 */
export const decodeJWT = (req, res) => {
  try {
    const { token, secret } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    // Split token
    const parts = token.split(".");
    if (parts.length !== 3) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid JWT format. Token must have 3 parts (header.payload.signature)",
      });
    }

    try {
      // Decode parts
      const headerDecoded = JSON.parse(base64UrlDecode(parts[0]));
      const payloadDecoded = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      let isValid = false;
      let verificationMessage = "Not verified (no secret provided)";

      // Verify signature if secret provided
      if (secret) {
        const message = `${parts[0]}.${parts[1]}`;
        const expectedSignature = createSignature(
          message,
          secret,
          headerDecoded.alg,
        );

        isValid = signature === expectedSignature;
        verificationMessage = isValid
          ? "Signature verified ✓"
          : "Signature invalid ✗";
      }

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payloadDecoded.exp && payloadDecoded.exp < now;

      // Get standard claims
      const standardClaims = {
        iss: payloadDecoded.iss,
        sub: payloadDecoded.sub,
        aud: payloadDecoded.aud,
        iat: payloadDecoded.iat,
        exp: payloadDecoded.exp,
        nbf: payloadDecoded.nbf,
        jti: payloadDecoded.jti,
      };

      // Get custom claims
      const customClaims = {};
      Object.keys(payloadDecoded).forEach((key) => {
        if (!standardClaims.hasOwnProperty(key)) {
          customClaims[key] = payloadDecoded[key];
        }
      });

      res.json({
        success: true,
        data: {
          isValid,
          isExpired,
          verificationMessage,
          header: headerDecoded,
          payload: payloadDecoded,
          standardClaims: Object.fromEntries(
            Object.entries(standardClaims).filter(([, v]) => v !== undefined),
          ),
          customClaims,
          expiresAt: payloadDecoded.exp
            ? new Date(payloadDecoded.exp * 1000).toISOString()
            : null,
          issuedAt: payloadDecoded.iat
            ? new Date(payloadDecoded.iat * 1000).toISOString()
            : null,
        },
      });
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Failed to decode token. Invalid base64 or JSON",
        error: parseError.message,
      });
    }
  } catch (error) {
    console.error("Error decoding JWT:", error);
    res.status(500).json({
      success: false,
      message: "Failed to decode JWT",
      error: error.message,
    });
  }
};

/**
 * Generate sample payload
 */
export const generateSamplePayload = (req, res) => {
  try {
    const samplePayload = {
      sub: "user123",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      permissions: ["read", "write", "delete"],
    };

    res.json({
      success: true,
      data: samplePayload,
    });
  } catch (error) {
    console.error("Error generating sample payload:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate sample payload",
      error: error.message,
    });
  }
};

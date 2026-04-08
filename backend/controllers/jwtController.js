import crypto from "crypto";

/**
 * Generate JWT tokens with various options
 */
export const generateJWTToken = (req, res) => {
  try {
    const {
      algorithm = "HS256",
      payload = {},
      secret = "",
      expiresIn = 3600,
      includeIat = true,
      includeJti = false,
      issuer = "",
      audience = "",
      subject = "",
    } = req.body;

    // Validation
    const supportedAlgorithms = ["HS256", "HS384", "HS512"];
    if (!supportedAlgorithms.includes(algorithm)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported algorithm. Use one of: ${supportedAlgorithms.join(", ")}`,
      });
    }

    if (!secret || secret.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Secret key is required",
      });
    }

    if (secret.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Secret key must be at least 8 characters long",
      });
    }

    if (typeof payload !== "object" || Array.isArray(payload)) {
      return res.status(400).json({
        success: false,
        message: "Payload must be a JSON object",
      });
    }

    if (expiresIn < 0) {
      return res.status(400).json({
        success: false,
        message: "Expiry must be a positive number (in seconds)",
      });
    }

    // Build header
    const header = {
      alg: algorithm,
      typ: "JWT",
    };

    // Build claims
    const now = Math.floor(Date.now() / 1000);
    const claims = { ...payload };

    if (includeIat) claims.iat = now;
    if (expiresIn > 0) claims.exp = now + expiresIn;
    if (includeJti) claims.jti = crypto.randomUUID();
    if (issuer) claims.iss = issuer;
    if (audience) claims.aud = audience;
    if (subject) claims.sub = subject;

    // Encode header and payload
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(claims));

    const signingInput = `${encodedHeader}.${encodedPayload}`;

    // Generate signature
    const hashAlgorithm = getHashAlgorithm(algorithm);
    const signature = crypto
      .createHmac(hashAlgorithm, secret)
      .update(signingInput)
      .digest("base64url");

    const token = `${signingInput}.${signature}`;

    // Token metadata
    const parts = {
      header: encodedHeader,
      payload: encodedPayload,
      signature,
    };

    const expiresAt =
      expiresIn > 0 ? new Date((now + expiresIn) * 1000).toISOString() : null;

    res.json({
      success: true,
      data: {
        token,
        parts,
        decoded: {
          header,
          payload: claims,
        },
        algorithm,
        expiresAt,
        generatedAt: new Date().toISOString(),
        tokenLength: token.length,
      },
    });
  } catch (error) {
    console.error("Error generating JWT token:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate JWT token",
      error: error.message,
    });
  }
};

/**
 * Decode and verify a JWT token
 */
export const decodeJWTToken = (req, res) => {
  try {
    const { token, secret = "" } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "JWT token is required",
      });
    }

    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid JWT format. Token must have 3 parts separated by dots",
      });
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Decode header
    let header;
    try {
      header = JSON.parse(base64UrlDecode(encodedHeader));
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid JWT header encoding",
      });
    }

    // Decode payload
    let payload;
    try {
      payload = JSON.parse(base64UrlDecode(encodedPayload));
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid JWT payload encoding",
      });
    }

    const now = Math.floor(Date.now() / 1000);

    // Check expiry
    const isExpired = payload.exp ? payload.exp < now : false;
    const expiresAt = payload.exp
      ? new Date(payload.exp * 1000).toISOString()
      : null;
    const issuedAt = payload.iat
      ? new Date(payload.iat * 1000).toISOString()
      : null;

    // Verify signature if secret is provided
    let signatureValid = null;
    if (secret) {
      try {
        const algorithm = header.alg || "HS256";
        const hashAlgorithm = getHashAlgorithm(algorithm);
        const signingInput = `${encodedHeader}.${encodedPayload}`;
        const expectedSignature = crypto
          .createHmac(hashAlgorithm, secret)
          .update(signingInput)
          .digest("base64url");
        signatureValid = signature === expectedSignature;
      } catch {
        signatureValid = false;
      }
    }

    res.json({
      success: true,
      data: {
        decoded: { header, payload },
        isExpired,
        isValid: signatureValid,
        expiresAt,
        issuedAt,
        tokenLength: token.length,
        parts: { header: encodedHeader, payload: encodedPayload, signature },
      },
    });
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    res.status(500).json({
      success: false,
      message: "Failed to decode JWT token",
      error: error.message,
    });
  }
};

// Helpers

const base64UrlEncode = (str) => Buffer.from(str).toString("base64url");

const base64UrlDecode = (str) => Buffer.from(str, "base64url").toString("utf8");

const getHashAlgorithm = (algorithm) => {
  switch (algorithm) {
    case "HS256":
      return "sha256";
    case "HS384":
      return "sha384";
    case "HS512":
      return "sha512";
    default:
      return "sha256";
  }
};

import crypto from "crypto";

/**
 * Check if password has been pwned using Have I Been Pwned API
 * @param {string} password - Password to check
 * @returns {object} - Pwned status and count
 */
const checkPasswordPwned = async (password) => {
  try {
    // Hash password using SHA-1
    const sha1Hash = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex")
      .toUpperCase();

    // Only send first 5 characters of hash to API (for privacy)
    const hashPrefix = sha1Hash.slice(0, 5);
    const hashSuffix = sha1Hash.slice(5);

    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${hashPrefix}`,
      {
        headers: {
          "User-Agent": "DevKit-Password-Generator",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to check pwned status");
    }

    const text = await response.text();
    const lines = text.split("\r\n");

    // Search for matching suffix in response
    for (const line of lines) {
      const [suffix, count] = line.split(":");
      if (suffix === hashSuffix) {
        return {
          isPwned: true,
          count: parseInt(count),
        };
      }
    }

    return {
      isPwned: false,
      count: 0,
    };
  } catch (error) {
    console.error("Error checking pwned status:", error);
    // Return null if API check fails, don't block password generation
    return {
      isPwned: null,
      count: null,
      error: error.message,
    };
  }
};

/**
 * Calculate password strength score
 * @param {string} password - Password to analyze
 * @returns {object} - Strength analysis
 */
const analyzePasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (!password) {
    return {
      strength: "Very Weak",
      score: 0,
      percentage: 0,
      feedback: ["Password cannot be empty"],
    };
  }

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 2;
  if (password.length >= 20) score += 1;

  // Character variety scoring
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }

  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password)) {
    score += 2;
  } else {
    feedback.push("Add special characters for better security");
  }

  // Pattern detection (penalty)
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push("Avoid repeating characters (aaa, 111)");
  }

  if (/^[0-9]+$/.test(password) || /^[a-z]+$/i.test(password)) {
    score -= 2;
    feedback.push("Avoid using only numbers or only letters");
  }

  // Sequential characters penalty
  if (
    /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
      password,
    )
  ) {
    score -= 1;
    feedback.push("Avoid sequential characters (abc, xyz)");
  }

  // Popular patterns penalty
  const commonPatterns = [
    "password",
    "123456",
    "qwerty",
    "admin",
    "letmein",
    "welcome",
  ];
  if (
    commonPatterns.some((pattern) => password.toLowerCase().includes(pattern))
  ) {
    score -= 2;
    feedback.push("Avoid common words and patterns");
  }

  // Cap the score
  score = Math.max(0, Math.min(10, score));

  let strength = "Very Weak";
  if (score >= 9) strength = "Very Strong";
  else if (score >= 7) strength = "Strong";
  else if (score >= 5) strength = "Good";
  else if (score >= 3) strength = "Fair";
  else if (score >= 1) strength = "Weak";

  const percentage = (score / 10) * 100;

  return {
    strength,
    score,
    percentage,
    feedback: feedback.length > 0 ? feedback : ["Strong password!"],
  };
};

/**
 * Generate random password
 * @param {object} options - Generation options
 * @returns {string} - Generated password
 */
const generatePassword = (options) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = false,
    excludeAmbiguous = false,
    length = 16,
  } = options;

  let characters = "";

  if (includeLowercase) {
    characters += excludeAmbiguous
      ? "abcdefghjkmnpqrstuvwxyz"
      : "abcdefghijklmnopqrstuvwxyz";
  }

  if (includeUppercase) {
    characters += excludeAmbiguous
      ? "ABCDEFGHJKMNPQRSTUVWXYZ"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (includeNumbers) {
    characters += excludeAmbiguous ? "23456789" : "0123456789";
  }

  if (includeSpecial) {
    characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  }

  if (characters.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    password += characters[randomIndex];
  }

  return password;
};

// Controllers
export const generatePasswords = async (req, res) => {
  try {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSpecial = false,
      excludeAmbiguous = false,
      passwordLength = 16,
      quantity = 1,
      checkPwned = true,
    } = req.body;

    // Validation
    if (passwordLength < 4 || passwordLength > 128) {
      return res.status(400).json({
        success: false,
        message: "Password length must be between 4 and 128 characters",
      });
    }

    if (quantity < 1 || quantity > 50) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 50",
      });
    }

    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSpecial
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one character type must be selected",
      });
    }

    // Generate passwords
    const passwords = [];
    for (let i = 0; i < quantity; i++) {
      passwords.push(
        generatePassword({
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSpecial,
          excludeAmbiguous,
          length: passwordLength,
        }),
      );
    }

    // Analyze each password
    const analyzedPasswords = await Promise.all(
      passwords.map(async (password) => {
        const strength = analyzePasswordStrength(password);

        let pwnedStatus = null;
        if (checkPwned) {
          pwnedStatus = await checkPasswordPwned(password);
        }

        return {
          password,
          strength,
          pwned: pwnedStatus,
        };
      }),
    );

    res.json({
      success: true,
      data: {
        passwords: analyzedPasswords,
        count: analyzedPasswords.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating passwords:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate passwords",
      error: error.message,
    });
  }
};

export const analyzePassword = async (req, res) => {
  try {
    const { password, checkPwned = true } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Analyze strength
    const strength = analyzePasswordStrength(password);

    // Check if pwned
    let pwnedStatus = null;
    if (checkPwned) {
      pwnedStatus = await checkPasswordPwned(password);
    }

    res.json({
      success: true,
      data: {
        password,
        length: password.length,
        strength,
        pwned: pwnedStatus,
        analysis: {
          hasUppercase: /[A-Z]/.test(password),
          hasLowercase: /[a-z]/.test(password),
          hasNumbers: /[0-9]/.test(password),
          hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password),
        },
      },
    });
  } catch (error) {
    console.error("Error analyzing password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze password",
      error: error.message,
    });
  }
};

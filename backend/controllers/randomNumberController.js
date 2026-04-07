import crypto from "crypto";

/**
 * Generate random numbers with various options
 * @param {object} options - Generation options
 * @returns {Array} - Generated random numbers
 */
export const generateRandomNumbers = (req, res) => {
  try {
    const {
      min = 0,
      max = 100,
      quantity = 1,
      distribution = "uniform",
      decimalPlaces = 0,
      unique = false,
    } = req.body;

    // Validation
    if (typeof min !== "number" || typeof max !== "number") {
      return res.status(400).json({
        success: false,
        message: "Min and max must be numbers",
      });
    }

    if (min >= max) {
      return res.status(400).json({
        success: false,
        message: "Min must be less than max",
      });
    }

    if (quantity < 1 || quantity > 1000) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 1000",
      });
    }

    if (decimalPlaces < 0 || decimalPlaces > 15) {
      return res.status(400).json({
        success: false,
        message: "Decimal places must be between 0 and 15",
      });
    }

    if (
      !["uniform", "normal", "exponential", "poisson"].includes(distribution)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid distribution. Use uniform, normal, exponential, or poisson",
      });
    }

    // Check unique constraint
    if (unique) {
      const range = max - min + 1;
      if (quantity > range) {
        return res.status(400).json({
          success: false,
          message: `Cannot generate ${quantity} unique numbers in range ${min}-${max}`,
        });
      }
    }

    const numbers = [];
    const usedNumbers = new Set();

    for (let i = 0; i < quantity; i++) {
      let number;

      if (distribution === "uniform") {
        number = generateUniform(min, max, decimalPlaces, usedNumbers, unique);
      } else if (distribution === "normal") {
        number = generateNormal(min, max, decimalPlaces);
      } else if (distribution === "exponential") {
        number = generateExponential(min, max, decimalPlaces);
      } else if (distribution === "poisson") {
        number = generatePoisson(min, max, decimalPlaces);
      }

      if (unique && usedNumbers.has(number)) {
        i--; // Retry this iteration
        continue;
      }

      if (unique) {
        usedNumbers.add(number);
      }

      numbers.push(number);
    }

    // Calculate statistics
    const stats = calculateStatistics(numbers);

    res.json({
      success: true,
      data: {
        numbers,
        count: numbers.length,
        distribution,
        range: { min, max },
        decimalPlaces,
        unique,
        statistics: stats,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating random numbers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate random numbers",
      error: error.message,
    });
  }
};

/**
 * Uniform distribution (random.org style)
 */
const generateUniform = (min, max, decimalPlaces, usedNumbers, unique) => {
  let number;

  if (decimalPlaces === 0) {
    // For integers, use crypto for better randomness
    const range = max - min + 1;
    const randomByte = crypto.randomInt(0, range);
    number = min + randomByte;
  } else {
    // For decimals
    const range = max - min;
    const random = crypto.randomBytes(4).readUInt32BE(0) / 0xffffffff;
    number = min + random * range;
    number = parseFloat(number.toFixed(decimalPlaces));
  }

  return number;
};

/**
 * Normal distribution (Box-Muller transform)
 */
const generateNormal = (min, max, decimalPlaces) => {
  const u1 = crypto.randomBytes(4).readUInt32BE(0) / 0xffffffff;
  const u2 = crypto.randomBytes(4).readUInt32BE(0) / 0xffffffff;

  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  const mean = (min + max) / 2;
  const stdDev = (max - min) / 6; // 99.7% within range (3 sigma)

  let number = mean + z * stdDev;
  number = Math.max(min, Math.min(max, number)); // Clamp to range

  return parseFloat(number.toFixed(decimalPlaces));
};

/**
 * Exponential distribution
 */
const generateExponential = (min, max, decimalPlaces) => {
  const lambda = 1 / ((max - min) / 2); // Scale parameter
  const random = crypto.randomBytes(4).readUInt32BE(0) / 0xffffffff;
  let number = min + -Math.log(1 - random) / lambda;
  number = Math.max(min, Math.min(max, number)); // Clamp to range

  return parseFloat(number.toFixed(decimalPlaces));
};

/**
 * Poisson distribution
 */
const generatePoisson = (min, max, decimalPlaces) => {
  const lambda = (max - min) / 2; // Adjusted for range
  let k = 0;
  let p = Math.exp(-lambda);
  let s = p;

  const random = crypto.randomBytes(4).readUInt32BE(0) / 0xffffffff;

  while (s < random) {
    k++;
    p *= lambda / k;
    s += p;
  }

  let number = min + (k % (max - min + 1));
  return parseFloat(number.toFixed(decimalPlaces));
};

/**
 * Calculate statistics for numbers
 */
const calculateStatistics = (numbers) => {
  if (numbers.length === 0) return {};

  // Mean
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;

  // Min/Max
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  // Median
  const sorted = [...numbers].sort((a, b) => a - b);
  const median =
    numbers.length % 2 === 0
      ? (sorted[numbers.length / 2 - 1] + sorted[numbers.length / 2]) / 2
      : sorted[Math.floor(numbers.length / 2)];

  // Standard deviation
  const variance =
    numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) /
    numbers.length;
  const stdDev = Math.sqrt(variance);

  // Range
  const range = max - min;

  return {
    count: numbers.length,
    mean: parseFloat(mean.toFixed(4)),
    median: parseFloat(median.toFixed(4)),
    min,
    max,
    range,
    standardDeviation: parseFloat(stdDev.toFixed(4)),
    variance: parseFloat(variance.toFixed(4)),
  };
};

/**
 * Analyze random numbers
 */
export const analyzeNumbers = (req, res) => {
  try {
    const { numbers } = req.body;

    if (!Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Numbers array is required and must not be empty",
      });
    }

    // Validate all are numbers
    if (!numbers.every((n) => typeof n === "number")) {
      return res.status(400).json({
        success: false,
        message: "All items must be numbers",
      });
    }

    const stats = calculateStatistics(numbers);

    res.json({
      success: true,
      data: {
        statistics: stats,
        numbers,
      },
    });
  } catch (error) {
    console.error("Error analyzing numbers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze numbers",
      error: error.message,
    });
  }
};

import Tool from "../models/tool.js";
import Category from "../models/category.js";
import crypto from "crypto";

export const createTool = async (req, res) => {
  try {
    const { name, description, category, icon } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: "Name, referenceId and category are required",
      });
    }

    // check category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    const tool = await Tool.create({
      name,
      description,
      category,
      icon,
    });

    res.status(201).json({
      message: "Tool created successfully",
      data: tool,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTools = async (req, res) => {
  try {
    const tools = await Tool.find({ isActive: true })
      .populate("category", "name slug description icon")
      .sort({ order: 1 });

    res.json({
      count: tools.length,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id).populate(
      "category",
      "name slug",
    );

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getToolBySlug = async (req, res) => {
  try {
    const tool = await Tool.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("category", "name slug");

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTool = async (req, res) => {
  try {
    const { name, referenceId, description, category, icon, isActive, order } =
      req.body;

    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    // check referenceId uniqueness
    if (referenceId && referenceId !== tool.referenceId) {
      const exists = await Tool.findOne({ referenceId });
      if (exists) {
        return res.status(400).json({
          message: "referenceId already exists",
        });
      }
      tool.referenceId = referenceId;
    }

    // validate category
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
      tool.category = category;
    }

    if (name) tool.name = name;
    if (description !== undefined) tool.description = description;
    if (icon !== undefined) tool.icon = icon;
    if (isActive !== undefined) tool.isActive = isActive;
    if (order !== undefined) tool.order = order;

    await tool.save(); // triggers slug update

    res.json({
      message: "Tool updated successfully",
      data: tool,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    await tool.deleteOne();

    res.json({
      message: "Tool deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateApiKey = (characters, keyLength, quantity) => {
  const keys = [];

  for (let i = 0; i < quantity; i++) {
    let key = "";
    const charLength = characters.length;

    for (let j = 0; j < keyLength; j++) {
      // Use crypto for secure random character selection
      const randomIndex = crypto.randomInt(0, charLength);
      key += characters[randomIndex];
    }

    keys.push(key);
  }

  return keys;
};

const generatePrefixedApiKey = (prefix, characters, keyLength, quantity) => {
  const keys = [];

  for (let i = 0; i < quantity; i++) {
    let key = "";
    const charLength = characters.length;

    for (let j = 0; j < keyLength; j++) {
      const randomIndex = crypto.randomInt(0, charLength);
      key += characters[randomIndex];
    }

    keys.push(`${prefix}_${key}`);
  }

  return keys;
};

// Controller
export const generateApiKeys = (req, res) => {
  try {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSpecial = false,
      keyLength = 32,
      quantity = 1,
      usePrefix = false,
      prefix = "sk_live",
    } = req.body;

    // Validation
    if (!keyLength || keyLength < 8 || keyLength > 512) {
      return res.status(400).json({
        success: false,
        message: "Key length must be between 8 and 512 characters",
      });
    }

    if (!quantity || quantity < 1 || quantity > 100) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 100",
      });
    }

    // Build character set
    let characterSet = "";

    if (includeUppercase) characterSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) characterSet += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) characterSet += "0123456789";
    if (includeSpecial) characterSet += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Ensure at least one character type is selected
    if (characterSet.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one character type must be selected",
      });
    }

    // Generate keys
    let keys;
    if (usePrefix && prefix) {
      keys = generatePrefixedApiKey(
        prefix,
        characterSet,
        keyLength - prefix.length - 1, // Account for prefix and underscore
        quantity,
      );
    } else {
      keys = generateApiKey(characterSet, keyLength, quantity);
    }

    res.json({
      success: true,
      data: {
        keys,
        count: keys.length,
        keyLength: usePrefix ? keyLength : keyLength,
        characterSet: {
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSpecial,
        },
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating API keys:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate API keys",
      error: error.message,
    });
  }
};

// Validate API Key format
export const validateApiKey = (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "API key is required",
      });
    }

    const analysis = {
      key: apiKey,
      length: apiKey.length,
      hasUppercase: /[A-Z]/.test(apiKey),
      hasLowercase: /[a-z]/.test(apiKey),
      hasNumbers: /[0-9]/.test(apiKey),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(apiKey),
      strength: calculateStrength(apiKey),
    };

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Error validating API key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate API key",
      error: error.message,
    });
  }
};

// Calculate strength score
const calculateStrength = (apiKey) => {
  let score = 0;

  if (apiKey.length >= 32) score += 2;
  else if (apiKey.length >= 16) score += 1;

  if (/[A-Z]/.test(apiKey)) score += 1;
  if (/[a-z]/.test(apiKey)) score += 1;
  if (/[0-9]/.test(apiKey)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(apiKey)) score += 2;

  if (score <= 2) return "Weak";
  if (score <= 4) return "Fair";
  if (score <= 6) return "Good";
  return "Strong";
};

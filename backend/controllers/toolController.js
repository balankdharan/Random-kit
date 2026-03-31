import Tool from "../models/tool.js";
import Category from "../models/category.js";

export const createTool = async (req, res) => {
  try {
    const { name, referenceId, description, category, icon, order } = req.body;

    if (!name || !referenceId || !category) {
      return res.status(400).json({
        message: "Name, referenceId and category are required",
      });
    }

    // check duplicate referenceId
    const existingRef = await Tool.findOne({ referenceId });
    if (existingRef) {
      return res.status(400).json({
        message: "referenceId already exists",
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
      referenceId,
      description,
      category,
      icon,
      order,
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
      .populate("category", "name slug")
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

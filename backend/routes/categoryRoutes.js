import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;

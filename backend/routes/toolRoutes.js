import express from "express";
import {
  createTool,
  getTools,
  getToolById,
  getToolBySlug,
  updateTool,
  deleteTool,
} from "../controllers/toolController.js";

const router = express.Router();

router.post("/", createTool);
router.get("/", getTools);
router.get("/slug/:slug", getToolBySlug);
router.get("/:id", getToolById);
router.put("/:id", updateTool);
router.delete("/:id", deleteTool);

export default router;

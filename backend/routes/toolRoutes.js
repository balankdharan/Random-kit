import express from "express";
import {
  createTool,
  getTools,
  getToolById,
  getToolBySlug,
  updateTool,
  deleteTool,
  generateApiKeys,
  validateApiKey,
} from "../controllers/toolController.js";
import { generateUUIDs, validateUUID } from "../controllers/uuidController.js";

const router = express.Router();

router.post("/", createTool);
router.get("/", getTools);
router.get("/slug/:slug", getToolBySlug);

//tools
//api-key
router.post("/api-key-generator", generateApiKeys);
router.post("/api-key-validator", validateApiKey);
//uuid
router.post("/uuid-generator", generateUUIDs);
router.post("/uuid-validator", validateUUID);

router.get("/:id", getToolById);
router.put("/:id", updateTool);
router.delete("/:id", deleteTool);

export default router;

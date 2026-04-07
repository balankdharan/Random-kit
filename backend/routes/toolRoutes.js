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
import {
  generateRandomNumbers,
  analyzeNumbers,
} from "../controllers/randomNumberController.js";
import {
  generateFakeUsers,
  generateSingleUser,
} from "../controllers/fakeUserController.js";
import {
  generateColors,
  convertColor,
  generatePalette,
} from "../controllers/colorController.js";
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

//random number
router.post("/random-number", generateRandomNumbers);
router.post("/random-number-analyzer", analyzeNumbers);

// fake use generate

router.post("/fake-user", generateFakeUsers);
router.post("/fake-user-single", generateSingleUser);

//color-generator
router.post("/color-generator", generateColors);
router.post("/color-converter", convertColor);
router.post("/color-palette", generatePalette);

router.get("/:id", getToolById);
router.put("/:id", updateTool);
router.delete("/:id", deleteTool);

export default router;

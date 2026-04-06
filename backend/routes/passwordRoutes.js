import express from "express";
import {
  generatePasswords,
  analyzePassword,
} from "../controllers/passwordController.js";

const router = express.Router();

router.post("/password-generator", generatePasswords);

router.post("/password-analyzer", analyzePassword);

export default router;

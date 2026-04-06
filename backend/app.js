import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import toolRoutes from "./routes/toolRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";

dotenv.config();

const app = express();

// DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/password", passwordRoutes);

export default app;

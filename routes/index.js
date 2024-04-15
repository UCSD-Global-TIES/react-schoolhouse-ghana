import path from "path";
import express from "express";
const router = express.Router();
import apiRoutes from "./api/index.js"; // Ensure this file exports an Express router or middleware

// API Routes
router.use("/api", apiRoutes);

// Export the configured router
export default router;

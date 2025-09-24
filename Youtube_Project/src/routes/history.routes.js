import { Router } from "express";
import { 
  addToWatchHistory, 
  getWatchHistory, 
  clearWatchHistory,
  removeFromWatchHistory 
} from "../controllers/history.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Adjust import path as needed

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// GET /api/v1/history - Get user's watch history
router.get("/", getWatchHistory);

// POST /api/v1/history - Add video to watch history
router.post("/", addToWatchHistory);

// DELETE /api/v1/history - Clear all watch history
router.delete("/", clearWatchHistory);

// DELETE /api/v1/history/:videoId - Remove specific video from history
router.delete("/:videoId", removeFromWatchHistory);

export default router;
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"; // Make sure this import exists

// Add video to watch history
export const addToWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { videoId } = req.body;

    // console.log("Adding to history - UserID:", userId, "VideoID:", videoId);

    if (!videoId) {
      return res.status(400).json({ message: "videoId is required" });
    }

    // Verify video exists
    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Remove if already exists (to move it to latest position)
    await User.findByIdAndUpdate(
      userId,
      { $pull: { watchHistory: { video: videoId } } },
      { new: true }
    );

    // Add to beginning of watch history
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          watchHistory: {
            $each: [{
              video: videoId,
              watchedAt: new Date(),
            }],
            $position: 0 // Add to beginning
          }
        },
      },
      { new: true }
    );

    // console.log("Successfully added to history. User watchHistory length:", updatedUser?.watchHistory?.length);

    res.status(200).json({ 
      message: "Video added to watch history",
      success: true 
    });
  } catch (error) {
    console.error("Error adding to watch history:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get watch history (removes old, returns latest first)
export const getWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // console.log("Fetching history for user:", userId);

    // Remove videos older than 7 days (increased from 1 day for better UX)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(userId, {
      $pull: { watchHistory: { watchedAt: { $lt: sevenDaysAgo } } },
    });

    // Fetch updated user history with populated video data
    const user = await User.findById(userId)
      .populate({
        path: "watchHistory.video",
        populate: {
          path: "owner",
          select: "username avatar fullName"
        }
      })
      .lean();

    // console.log("User found:", !!user);
    // console.log("Watch history length:", user?.watchHistory?.length || 0);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out any entries where video failed to populate (deleted videos)
    const validHistory = (user.watchHistory || [])
      .filter(item => item.video && typeof item.video === 'object')
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));

    // console.log("Valid history entries:", validHistory.length);

    res.status(200).json({
      history: validHistory,
      success: true
    });
  } catch (error) {
    console.error("Error fetching watch history:", error);
    res.status(500).json({ message: error.message });
  }
};

// Optional: Clear watch history
export const clearWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(
      userId,
      { $set: { watchHistory: [] } },
      { new: true }
    );

    res.status(200).json({ 
      message: "Watch history cleared successfully",
      success: true 
    });
  } catch (error) {
    console.error("Error clearing watch history:", error);
    res.status(500).json({ message: error.message });
  }
};

// Optional: Remove specific video from history
export const removeFromWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({ message: "videoId is required" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { watchHistory: { video: videoId } } },
      { new: true }
    );

    res.status(200).json({ 
      message: "Video removed from watch history",
      success: true 
    });
  } catch (error) {
    console.error("Error removing from watch history:", error);
    res.status(500).json({ message: error.message });
  }
};
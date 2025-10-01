import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    incrementView,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

// ✅ PUBLIC ROUTES (no authentication required)
// Place these BEFORE verifyJWT middleware
router.get("/", getAllVideos); // Public: anyone can view videos
router.get("/:videoId", getVideoById); // Public: anyone can view a video
router.patch("/:videoId/view", incrementView); // ✅ Public: anyone can increment view

// ✅ PROTECTED ROUTES (authentication required)
router.use(verifyJWT); // All routes after this require authentication

router.post(
    "/",
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishAVideo
);

router.patch("/toggle/publish/:videoId", togglePublishStatus);

router.delete("/:videoId", deleteVideo);

router.patch(
    "/:videoId",
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    updateVideo
);

export default router;
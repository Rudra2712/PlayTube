import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinery.js";

// const getAllVideos = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     query,
//     sortBy = "createdAt",
//     sortType = "desc",
//     userId,
//     username,
//   } = req.query;

//   // Build filter
//   const filter = {};

//   if (query) {
//     filter.$or = [
//       { title: { $regex: query, $options: "i" } },
//       { description: { $regex: query, $options: "i" } },
//     ];
//   }

//   // If userId is provided
//   if (userId && isValidObjectId(userId)) {
//     filter.owner = userId;
//   }

//   // If username is provided
//   if (username && !userId) {
//     const user = await User.findOne({
//       username: username.trim(),
//     });
//     if (!user) {
//       return res.status(404).json(new ApiResponse(404, null, "User not found"));
//     }
//     filter.owner = user._id;
//   }

//   // Sorting
//   const sort = {};
//   sort[sortBy] = sortType === "asc" ? 1 : -1;

//   // Pagination
//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const perPage = parseInt(limit);

//   // Query videos
//   const [videos, total] = await Promise.all([
//     Video.find(filter)
//       .populate("owner", "username avatar fullName")
//       .sort(sort)
//       .skip(skip)
//       .limit(perPage),
//     Video.countDocuments(filter),
//   ]);

//   // ✅ Add like counts to each video
//   const videosWithLikes = await Promise.all(
//     videos.map(async (video) => {
//       const likesCount = await Like.countDocuments({ video: video._id });
//       return {
//         ...video.toObject(),
//         likesCount,
//       };
//     })
//   );

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         videos: videosWithLikes,
//         total,
//         page: parseInt(page),
//         limit: perPage,
//         totalPages: Math.ceil(total / perPage),
//       },
//       "Videos fetched successfully"
//     )
//   );
// });
const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
    username,
  } = req.query;

  // Build filter
  const filter = {};

  // ✅ FIXED: Only filter published videos if the requester is NOT the owner
  // const isOwnerRequest =
  //   req.user?._id && userId && userId === req.user._id.toString();

  // if (!isOwnerRequest) {
  //   // If not the owner viewing their own content, only show published videos
  //   filter.isPublished = true;
  // }
  // If it IS the owner, don't add the isPublished filter (show all videos)

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // If userId is provided
  if (userId && isValidObjectId(userId)) {
    filter.owner = userId;
  }

  // If username is provided
  if (username && !userId) {
    const user = await User.findOne({
      username: username.trim(),
    });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }
    filter.owner = user._id;
  }

  // Sorting
  const sort = {};
  sort[sortBy] = sortType === "asc" ? 1 : -1;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const perPage = parseInt(limit);

  // Query videos
  const [videos, total] = await Promise.all([
    Video.find(filter)
      .populate("owner", "username avatar fullName")
      .sort(sort)
      .skip(skip)
      .limit(perPage),
    Video.countDocuments(filter),
  ]);

  // ✅ Add like counts to each video
  const videosWithLikes = await Promise.all(
    videos.map(async (video) => {
      const likesCount = await Like.countDocuments({ video: video._id });
      return {
        ...video.toObject(),
        likesCount,
      };
    }),
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: videosWithLikes,
        total,
        page: parseInt(page),
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
      "Videos fetched successfully",
    ),
  );
});
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Video file upload failed");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail upload failed");
  }

  const duration = videoFile.duration || 0;

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration,
    owner: req.user._id,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(500, "Video creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "username fullName avatar",
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // ✅ Add like count to the video
  const likesCount = await Like.countDocuments({ video: videoId });
  const videoWithLikes = {
    ...video.toObject(),
    likesCount,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, videoWithLikes, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!uploadedThumbnail) {
      throw new ApiError(400, "Thumbnail upload failed");
    }
    video.thumbnail = uploadedThumbnail.url;
  } else if (req.body.thumbnail) {
    video.thumbnail = req.body.thumbnail;
  }

  await video.save();

  // ✅ Add like count to response
  const likesCount = await Like.countDocuments({ video: videoId });
  const videoWithLikes = {
    ...video.toObject(),
    likesCount,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, videoWithLikes, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `Video publish status toggled to ${video.isPublished ? "published" : "unpublished"}`,
      ),
    );
});

const incrementView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true },
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // ✅ Add like count to response
  const likesCount = await Like.countDocuments({ video: videoId });
  const videoWithLikes = {
    ...video.toObject(),
    likesCount,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, videoWithLikes, "View count updated"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  incrementView,
};

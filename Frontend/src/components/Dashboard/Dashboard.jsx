import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UploadVideo from "../Channel/UploadVideo";
import DeleteVideo from "./DeleteVideo";
import { Link } from "react-router-dom";
import EditVideo from "./EditVideo";
import {
  getAllVideos,
  deleteVideo,
  updateVideo,
  togglePublish, // Make sure this is imported
  setVideos, // Import the setVideos action
} from "../../app/Slices/videoSlice";
import { axiosInstance } from "../../helpers/axios.helper";
import { toast } from "react-toastify";

function Dashboard() {
  const dispatch = useDispatch();
  const { videos = [], loading } = useSelector((state) => state.video || {});
  const loggedInUser = useSelector((state) => state.auth?.userData);
  const channelId = loggedInUser?._id || loggedInUser?.id;
  const [showUpload, setShowUpload] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [likeCounts, setLikeCounts] = useState({});

  // Fetch videos when component mounts or channelId changes
  useEffect(() => {
    if (channelId) {
      dispatch(getAllVideos({ userId: channelId }))
        .unwrap?.()
        .catch((err) => console.error("Fetch videos error:", err));
    }
  }, [channelId, dispatch]);

  // Fetch like counts for all videos
  useEffect(() => {
    const fetchLikeCounts = async () => {
      if (!videos || videos.length === 0) return;

      try {
        const counts = {};
        await Promise.all(
          videos.map(async (video) => {
            try {
              const response = await axiosInstance.get(
                `/likes/status/${video._id}`
              );
              counts[video._id] = response.data.data.likesCount || 0;
            } catch (error) {
              console.error(
                `Failed to fetch likes for video ${video._id}:`,
                error
              );
              counts[video._id] = 0;
            }
          })
        );
        setLikeCounts(counts);
      } catch (error) {
        console.error("Error fetching like counts:", error);
      }
    };

    fetchLikeCounts();
  }, [videos]);

  // Refetch videos when user returns to the dashboard tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && channelId) {
        dispatch(getAllVideos({ userId: channelId }))
          .unwrap?.()
          .catch((err) => console.error("Refetch videos error:", err));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [channelId, dispatch]);

  // ✅ ADD THIS FUNCTION: Handle publish toggle
  const handleTogglePublish = async (videoId) => {
    try {
      await dispatch(togglePublish(videoId)).unwrap();
      // Update the local state to reflect the change
      const updatedVideos = videos.map((video) =>
        video._id === videoId
          ? { ...video, isPublished: !video.isPublished }
          : video
      );
      dispatch(setVideos(updatedVideos)); // Add setVideos action to your slice
      toast.success("Video visibility updated successfully!");
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      toast.error("Failed to update publish status");
    }
  };

  const handleUpdateVideo = (videoId, updatedData) => {
    console.log("Updating video with ID:", videoId);

    dispatch(updateVideo({ videoId, data: updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Video updated successfully!");
        if (channelId) {
          dispatch(getAllVideos({ userId: channelId }));
        }
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error("Failed to update video");
      });
  };

  // Calculate total views and likes from videos + likeCounts
  const { totalViews, totalLikes } = useMemo(() => {
    const totals = videos.reduce(
      (acc, v) => {
        acc.views += Number(v.views || 0);
        acc.likes += Number(likeCounts[v._id] || 0);
        return acc;
      },
      { views: 0, likes: 0 }
    );
    return { totalViews: totals.views, totalLikes: totals.likes };
  }, [videos, likeCounts]);

  const openDelete = (videoId) => {
    setSelectedVideoId(videoId);
    setDeleteModalOpen(true);
  };

  const closeDelete = () => {
    setSelectedVideoId(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = async (videoId) => {
    try {
      await dispatch(deleteVideo(videoId)).unwrap();
      if (channelId) {
        dispatch(getAllVideos({ userId: channelId }));
      }
      closeDelete();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  function formatDurationSeconds(duration) {
    const secs = Math.max(0, Math.floor(Number(duration) || 0));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-8 px-6 py-10 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome Back,{" "}
            {loggedInUser?.fullName || loggedInUser?.username || "Creator"}
          </h1>
          <p className="text-sm text-gray-400">
            Seamless Video Management, Elevated Results.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Views</div>
            <div className="text-2xl font-bold">
              {totalViews.toLocaleString()}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">Total Likes</div>
            <div className="text-2xl font-bold">
              {totalLikes.toLocaleString()}
            </div>
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="rounded-xl bg-[#ae7aff] px-5 py-2 font-semibold text-black shadow hover:bg-[#9a66e5] transition"
          >
            + Upload Video
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-auto rounded-xl border border-gray-700 bg-gray-900 shadow">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 w-14 text-center">Select</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Stats</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  Loading videos...
                </td>
              </tr>
            ) : videos.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  No videos uploaded yet.
                </td>
              </tr>
            ) : (
              videos.map((video) => (
                <tr
                  key={video._id}
                  className="border-t border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#ae7aff]"
                      aria-label={`select ${video.title}`}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={video.isPublished} // true → Published, false → Draft
                        onChange={() => handleTogglePublish(video._id)}
                        className="h-5 w-5 accent-green-500 cursor-pointer"
                        aria-label={`Toggle publish status for ${video.title}`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          video.isPublished ? "text-green-400" : "text-gray-400"
                        }`}
                      >
                        {video.isPublished ? "Published" : "Draft"}
                      </span>
                    </label>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-28 overflow-hidden rounded bg-gray-700">
                        <Link
                          to={`/video/${video._id}`}
                          className="block h-full w-full"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-2 py-0.5 text-xs">
                          {formatDurationSeconds(video.duration)}
                        </div>
                      </div>

                      <div>
                        <Link to={`/video/${video._id}`} className="block">
                          <h6 className="font-semibold">{video.title}</h6>
                        </Link>
                        <p className="text-sm text-gray-400">
                          {video.views?.toLocaleString() ?? 0} views ·{" "}
                          {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <span className="rounded bg-green-200 px-2 py-1 text-sm text-green-800">
                        {(likeCounts[video._id] || 0).toLocaleString()} likes
                      </span>
                      <span className="rounded bg-gray-800 px-2 py-1 text-sm text-gray-300">
                        {(Number(video.views) || 0).toLocaleString()} views
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedVideo(video);
                          setEditOpen(true);
                        }}
                        className="text-sm text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(video._id)}
                        className="text-sm text-red-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editOpen && selectedVideo && (
        <EditVideo
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          video={selectedVideo}
          onUpdate={handleUpdateVideo}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl bg-gray-900 shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Video</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close upload"
              >
                ✕
              </button>
            </div>

            <UploadVideo
              onSuccess={() => {
                setShowUpload(false);
                if (channelId) {
                  dispatch(getAllVideos({ userId: channelId }));
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedVideoId && (
        <DeleteVideo
          videoId={selectedVideoId}
          onClose={closeDelete}
          onConfirm={() => handleDeleteConfirmed(selectedVideoId)}
        />
      )}
    </div>
  );
}

export default Dashboard;

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
} from "../../app/Slices/videoSlice";
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
  useEffect(() => {
    if (channelId) {
      dispatch(getAllVideos({ userId: channelId }))
        .unwrap?.()
        .catch((err) => console.error("Fetch videos error:", err));
    }
  }, [channelId, dispatch]);

  // Dashboard.jsx
  const handleUpdateVideo = (videoId, updatedData) => {
    console.log("Updating video with ID:", videoId);

    // ✅ Pass plain object, thunk will decide if FormData is needed
    dispatch(updateVideo({ videoId, data: updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Video updated successfully!");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error("Failed to update video");
      });
  };

  // Derived stats (simple sums)
  const { totalViews, totalLikes } = useMemo(() => {
    const totals = videos.reduce(
      (acc, v) => {
        acc.views += Number(v.views || 0);
        acc.likes += Number(v.likes || v.likeCount || v.likesCount || 0);
        return acc;
      },
      { views: 0, likes: 0 }
    );
    return { totalViews: totals.views, totalLikes: totals.likes };
  }, [videos]);

  const openDelete = (videoId) => {
    setSelectedVideoId(videoId);
    setDeleteModalOpen(true);
  };

  const closeDelete = () => {
    setSelectedVideoId(null);
    setDeleteModalOpen(false);
  };

  // Called after delete success to refresh list
  const handleDeleteConfirmed = async (videoId) => {
    try {
      await dispatch(deleteVideo(videoId)).unwrap();
      // refetch videos after deletion
      if (channelId) {
        dispatch(getAllVideos({ userId: channelId }));
      }
      closeDelete();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  function formatDurationSeconds(duration) {
    // Accepts seconds (or string/number). Falls back to 0.
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
          <h1 className="text-3xl font-bold">Welcome Back, React Patterns</h1>
          <p className="text-sm text-gray-400">
            Seamless Video Management, Elevated Results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-400">Total views</div>
            <div className="text-lg font-semibold">
              {totalViews.toLocaleString()}
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

                  <td className="px-4 py-3 text-sm text-gray-300">
                    {/* If you have a publish flag use it; fall back to 'Published' */}
                    {video.isPublished === false ? (
                      <span className="rounded-2xl border px-2 py-0.5 text-sm text-gray-300">
                        Draft
                      </span>
                    ) : (
                      <span className="rounded-2xl border px-2 py-0.5 text-sm text-green-400">
                        Published
                      </span>
                    )}
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
                        {(
                          Number(video.likes) ||
                          Number(video.likeCount) ||
                          0
                        ).toLocaleString()}{" "}
                        likes
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
                  {/* Edit Modal */}
                  {editOpen && selectedVideo && (
                    <EditVideo
                      isOpen={editOpen}
                      onClose={() => setEditOpen(false)}
                      video={selectedVideo}
                      onUpdate={handleUpdateVideo}
                    />
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

            <UploadVideo onSuccess={() => setShowUpload(false)} />
          </div>
        </div>
      )}

      {/* Delete Modal — we're passing onClose and handler to call delete thunk */}
      {deleteModalOpen && selectedVideoId && (
        <DeleteVideo
          videoId={selectedVideoId}
          onClose={closeDelete}
          // If DeleteVideo needs a callback instead of calling delete thunk itself,
          // it can call onClose or we can pass handleDeleteConfirmed function.
          // Here we'll allow DeleteVideo to call onClose; but to run delete action from Dashboard:
          // If your DeleteVideo component accepts a onConfirm prop, prefer:
          // onConfirm={() => handleDeleteConfirmed(selectedVideoId)}
          onConfirm={() => handleDeleteConfirmed(selectedVideoId)}
        />
      )}
    </div>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist, // 🆕 ensure you have this imported
} from "../../app/Slices/playlistSlice";
import { toast } from "react-toastify";

function PlaylistVideos() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singlePlaylist: playlist, loading } = useSelector(
    (state) => state.playlist
  );
  const currentUser = useSelector(
    (state) => state.auth?.user || state.user?.data
  );

  const [isEditing, setIsEditing] = useState(false); // 🆕 default false now
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToRemove, setVideoToRemove] = useState(null);
  const [addVideoId, setAddVideoId] = useState(""); // 🆕 input for adding video

  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistById(playlistId));
    }
  }, [playlistId, dispatch]);

  useEffect(() => {
    if (playlist && !Array.isArray(playlist)) {
      setEditedName(playlist.name || "");
      setEditedDescription(playlist.description || "");
    }
  }, [playlist]);

  const isOwner =
    currentUser &&
    playlist &&
    !Array.isArray(playlist) &&
    (currentUser._id === playlist.owner?._id ||
      currentUser._id === playlist.owner);

  const handleUpdatePlaylist = async () => {
    if (!editedName.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }

    try {
      await dispatch(
        updatePlaylist({
          playlistId,
          data: {
            name: editedName,
            description: editedDescription,
          },
        })
      ).unwrap();
      setIsEditing(false);
      toast.success("Playlist updated successfully");
    } catch (error) {
      toast.error("Failed to update playlist");
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await dispatch(removeVideoFromPlaylist({ videoId, playlistId })).unwrap();
      toast.success("Video removed from playlist");
      dispatch(getPlaylistById(playlistId));
    } catch (error) {
      toast.error("Failed to remove video");
    }
    setVideoToRemove(null);
  };

  const handleDeletePlaylist = async () => {
    try {
      await dispatch(deletePlaylist(playlistId)).unwrap();
      toast.success("Playlist deleted successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to delete playlist");
    }
    setShowDeleteModal(false);
  };

  // 🆕 handle adding video
  const handleAddVideo = async () => {
    if (!addVideoId.trim()) {
      toast.error("Enter a valid video ID");
      return;
    }
    try {
      await dispatch(addVideoToPlaylist({ playlistId, videoId: addVideoId })).unwrap();
      toast.success("Video added to playlist");
      dispatch(getPlaylistById(playlistId));
      setAddVideoId("");
    } catch (error) {
      toast.error("Failed to add video");
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-300">Loading playlist...</p>
    );

  if (!playlist || Array.isArray(playlist)) {
    return (
      <p className="text-center py-10 text-gray-400">Playlist not found.</p>
    );
  }

  return (
    <section className="w-full pb-[70px] sm:pb-0">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 ml-4 mt-4 flex items-center gap-2 text-white hover:text-gray-300 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>

      <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
        {/* Left side – playlist info */}
        <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
          {/* Thumbnail */}
          <div className="relative mb-2 w-full pt-[56%]">
            <img
              src={
                playlist.videos?.[0]?.thumbnail ||
                "https://via.placeholder.com/640x360?text=No+Thumbnail"
              }
              alt={playlist.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0">
              <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                <div className="relative z-[1]">
                  <p className="flex justify-between text-sm">
                    <span>Playlist</span>
                    <span>{playlist.videos?.length || 0} videos</span>
                  </p>
                  <p className="text-xs text-gray-200">
                    {playlist.views || 0} views ·{" "}
                    {new Date(playlist.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🆕 Add Video section (only owner) */}
          {isOwner && (
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter Video ID"
                value={addVideoId}
                onChange={(e) => setAddVideoId(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddVideo}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Add
              </button>
            </div>
          )}

          {/* Playlist Name & Description */}
          {isEditing ? (
            <div className="mb-4">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full mb-2 px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Playlist name"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                placeholder="Playlist description"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleUpdatePlaylist}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(playlist.name);
                    setEditedDescription(playlist.description);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-1">
                <h6 className="font-semibold text-lg text-white">
                  {playlist.name}
                </h6>

                {/* 🆕 Edit button */}
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white transition"
                    title="Edit playlist"
                  >
                    ✏️
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {playlist.description || "No description"}
              </p>
            </>
          )}

          {/* Owner Info */}
          <div className="mt-6 flex items-center gap-x-3">
            <div className="h-16 w-16 shrink-0">
              <img
                src={playlist.owner?.avatar || "/default-avatar.png"}
                alt={playlist.owner?.username || "Owner"}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="w-full">
              <h6 className="font-semibold text-white">
                {playlist.owner?.username}
              </h6>
              <p className="text-sm text-gray-300">Playlist Author</p>
            </div>
          </div>

          {/* Delete Playlist Button */}
          {isOwner && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Delete Playlist
            </button>
          )}
        </div>

        {/* Right side – videos */}
        <div className="flex-1 flex flex-col gap-4">
          {playlist.videos && playlist.videos.length > 0 ? (
            playlist.videos.map((video) => (
              <div
                key={video._id}
                className="flex gap-4 rounded-lg bg-gray-800 p-3 hover:bg-gray-700 transition relative group"
              >
                <Link to={`/video/${video._id}`} className="flex gap-4 flex-1">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h6 className="font-semibold text-white line-clamp-1">
                      {video.title}
                    </h6>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {video.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {video.views} views ·{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>

                {/* 🆕 Remove button (always visible to owner only) */}
                {isOwner && (
                  <button
                    onClick={() => setVideoToRemove(video._id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    title="Remove from playlist"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-10">
              No videos in this playlist
            </p>
          )}
        </div>
      </div>

      {/* Delete Playlist Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Delete Playlist?
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{playlist.name}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Video Modal */}
      {videoToRemove && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Remove Video?
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove this video from the playlist?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setVideoToRemove(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveVideo(videoToRemove)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PlaylistVideos;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addVideoToPlaylist,
  getPlaylistById,
} from "../../app/Slices/playlistSlice";
import { getAllVideos } from "../../app/Slices/videoSlice";
import { toast } from "react-toastify";

function AddVideoToPlaylist() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedVideos, setSelectedVideos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { singlePlaylist: playlist, loading: playlistLoading } = useSelector(
    (state) => state.playlist
  );
  const { videos: userVideos, loading: videosLoading } = useSelector(
    (state) => state.video
  );
  const currentUser = useSelector((state) => state.auth?.userData);

  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistById(playlistId));
    }
  }, [playlistId, dispatch]);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllVideos({ userId: currentUser._id }));
    }
  }, [currentUser, dispatch]);

  const isOwner =
    currentUser &&
    playlist &&
    !Array.isArray(playlist) &&
    (currentUser._id === playlist.owner?._id ||
      currentUser._id === playlist.owner);

  // Filter videos that are not already in the playlist
  const availableVideos =
    userVideos?.filter((video) => {
      const isInPlaylist = playlist?.videos?.some((pv) => pv._id === video._id);
      const matchesSearch = video.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return !isInPlaylist && matchesSearch;
    }) || [];

  const handleVideoToggle = (videoId) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(videoId)) {
      newSelected.delete(videoId);
    } else {
      newSelected.add(videoId);
    }
    setSelectedVideos(newSelected);
  };

  const handleAddSelectedVideos = async () => {
    if (selectedVideos.size === 0) {
      toast.error("Please select at least one video");
      return;
    }

    if (!isOwner) {
      toast.error("You can only add videos to your own playlists");
      return;
    }

    setIsLoading(true);
    try {
      // Add videos one by one
      const promises = Array.from(selectedVideos).map((videoId) =>
        dispatch(addVideoToPlaylist({ playlistId, videoId })).unwrap()
      );

      await Promise.all(promises);
      toast.success(
        `${selectedVideos.size} video(s) added to playlist successfully`
      );
      navigate(`/playlist/${playlistId}`);
    } catch (error) {
      toast.error("Failed to add some videos to playlist");
    } finally {
      setIsLoading(false);
    }
  };

  if (playlistLoading || videosLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!playlist || Array.isArray(playlist)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Playlist not found</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">
          You don't have permission to add videos to this playlist
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(`/playlist/${playlistId}`)}
        className="mb-6 flex items-center gap-2 text-white hover:text-gray-300 transition"
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
        Back to Playlist
      </button>

      {/* Playlist info */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Add Video to Playlist
        </h1>
        <div className="flex items-center gap-4">
          <img
            src={
              playlist.videos?.[0]?.thumbnail ||
              "https://via.placeholder.com/120x68?text=No+Thumbnail"
            }
            alt={playlist.name}
            className="w-20 h-12 object-cover rounded"
          />
          <div>
            <h2 className="text-lg font-semibold text-white">
              {playlist.name}
            </h2>
            <p className="text-gray-400 text-sm">
              {playlist.videos?.length || 0} videos
            </p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your videos..."
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
        />
      </div>

      {/* Video selection */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            Select Videos to Add ({selectedVideos.size} selected)
          </h3>
          <div className="flex gap-3">
            <button
              onClick={handleAddSelectedVideos}
              disabled={isLoading || selectedVideos.size === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                `Add Selected (${selectedVideos.size})`
              )}
            </button>
            <button
              onClick={() => navigate(`/playlist/${playlistId}`)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>

        {availableVideos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">
              {userVideos?.length === 0
                ? "You haven't uploaded any videos yet."
                : searchTerm
                ? "No videos match your search."
                : "All your videos are already in this playlist."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableVideos.map((video) => (
              <div
                key={video._id}
                className={`relative bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedVideos.has(video._id)
                    ? "ring-2 ring-blue-500 bg-gray-600"
                    : "hover:bg-gray-600"
                }`}
                onClick={() => handleVideoToggle(video._id)}
              >
                {/* Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedVideos.has(video._id)}
                    onChange={() => handleVideoToggle(video._id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                {/* Thumbnail */}
                <div className="relative w-full pt-[56%]">
                  <img
                    src={
                      video.thumbnail ||
                      "https://via.placeholder.com/640x360?text=No+Thumbnail"
                    }
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration || "0:00"}
                  </div>
                </div>

                {/* Video info */}
                <div className="p-3">
                  <h4
                    className="text-white font-medium text-sm mb-1 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {video.title}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {video.views || 0} views •{" "}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Selected overlay */}
                {selectedVideos.has(video._id) && (
                  <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                    <div className="bg-blue-600 text-white rounded-full p-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddVideoToPlaylist;

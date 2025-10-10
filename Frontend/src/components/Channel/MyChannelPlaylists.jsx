import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserPlaylists,
  deletePlaylist,
} from "../../app/Slices/playlistSlice";
import { toast } from "react-toastify";
import MyChannelEmptyPlaylist from "./MyChannelEmptyPlaylist";
import EmptyPlaylist from "../Playlist/EmptyPlaylist";
function MyChannelPlaylists() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth?.user || state.user?.data);
  const { data: playlists, loading } = useSelector((state) => state.playlist);

  // Fetch logged-in user's playlists
  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserPlaylists(currentUser._id));
    }
  }, [currentUser, dispatch]);

  const handleEdit = (playlistId) => {
    navigate(`/playlist/${playlistId}`); // will open PlaylistVideos page for editing
  };

  const handleAddVideo = (playlistId) => {
    navigate(`/playlist/${playlistId}/add-video`);
  };

  const handleDelete = async (playlistId) => {
    try {
      await dispatch(deletePlaylist(playlistId)).unwrap();
      toast.success("Playlist deleted successfully");
      dispatch(getUserPlaylists(currentUser._id)); // refresh list
    } catch (error) {
      toast.error("Failed to delete playlist");
    }
  };

  if (loading) {
    return <p className="text-gray-300 text-center py-10">Loading playlists...</p>;
  }
  console.log("📂 User Playlists:", playlists);
  // If no playlists
  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <EmptyPlaylist />;
  }

  return (
    <div className="p-4">
      <h2 className="text-white text-xl font-semibold mb-4">Your Playlists</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {playlists.map((pl) => (
          <div
            key={pl._id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:bg-gray-700 transition group relative"
          >
            {/* Thumbnail */}
            <div
              onClick={() => navigate(`/playlist/${pl._id}`)}
              className="relative w-full pt-[56%] cursor-pointer"
            >
              <img
                src={
                  pl.videos?.[0]?.thumbnail ||
                  "https://via.placeholder.com/640x360?text=No+Videos"
                }
                alt={pl.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {pl.videos?.length || 0} videos
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-1 line-clamp-1">
                {pl.name}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                {pl.description || "No description available"}
              </p>
            </div>

            {/* Owner controls (show on hover or always visible) */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => handleEdit(pl._id)}
                className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                title="Edit Playlist"
              >
                Edit
              </button>
              <button
                onClick={() => handleAddVideo(pl._id)}
                className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700"
                title="Add Video"
              >
                Add
              </button>
              <button
                onClick={() => handleDelete(pl._id)}
                className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                title="Delete Playlist"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyChannelPlaylists;

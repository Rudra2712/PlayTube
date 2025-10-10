import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../../app/Slices/playlistSlice";
import { axiosInstance } from "../../helpers/axios.helper";
import EmptyPlaylist from "./EmptyPlaylist";

function ChannelPlaylist() {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.playlist);
  const [userId, setUserId] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  // First, fetch the user ID from username
  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) return;
      
      try {
        setFetchingUser(true);
        const response = await axiosInstance.get(`/users/c/${username}`);
        const fetchedUserId = response.data.data._id;
        setUserId(fetchedUserId);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserId();
  }, [username]);

  // Then fetch playlists using the userId
  useEffect(() => {
    if (userId) {
      dispatch(getUserPlaylists(userId));
    }
  }, [userId, dispatch]);

  // Handle playlist click - navigate to PlaylistVideos page
  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  if (fetchingUser || loading) {
    return <p className="text-white">Loading playlists...</p>;
  }

  // Ensure data is an array before mapping
  const playlists = Array.isArray(data) ? data : [];

  // Show playlists grid
  if (playlists.length === 0) {
    return <EmptyPlaylist />;
  }

  return (
    <div className="p-4">
      <h2 className="text-white text-xl font-semibold mb-4">Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((pl) => (
          <div
            key={pl._id}
            onClick={() => handlePlaylistClick(pl._id)}
            className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {/* Playlist Thumbnail */}
            <div className="relative mb-3 w-full pt-[56%] bg-gray-900 rounded-md overflow-hidden">
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
            
            {/* Playlist Info */}
            <h3 className="text-white font-medium mb-1 line-clamp-2">{pl.name}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {pl.description || "No description"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChannelPlaylist;
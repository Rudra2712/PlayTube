import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../app/Slices/videoSlice";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.video);
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    // Fetch all videos when component mounts
    dispatch(getAllVideos());
  }, [dispatch]);

  useEffect(() => {
    // Filter videos based on search query
    if (videos && query) {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description?.toLowerCase().includes(query.toLowerCase()) ||
        video.owner?.username?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos([]);
    }
  }, [videos, query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-[70px] sm:pb-0">
      <div className="flex flex-wrap gap-4 p-4">
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-400">
              {filteredVideos.length} result{filteredVideos.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-gray-600 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <Link
                  key={video._id}
                  to={`/video/${video._id}`}
                  className="flex gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={video.thumbnail || "https://via.placeholder.com/320x180?text=No+Thumbnail"}
                      alt={video.title}
                      className="w-80 h-44 object-cover rounded-lg"
                    />
                    <div className="mt-2 text-xs text-gray-400">
                      {video.duration || "0:00"}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <span>{video.views || 0} views</span>
                      <span>•</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={video.owner?.avatar || "/default-avatar.png"}
                        alt={video.owner?.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-300">
                        {video.owner?.username}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {video.description || "No description available"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
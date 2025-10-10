import React from "react";
import { Link } from "react-router-dom";

function VideoGrid({ videos }) {
  // Filter only published videos for homepage
  const publishedVideos = videos.filter(video => video.isPublished !== false);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {publishedVideos.map((video) => (
          <div key={video._id} className="group cursor-pointer">
            <Link to={`/video/${video._id}`} className="block">
              {/* Thumbnail */}
              <div className="relative mb-3 w-full pt-[56%] overflow-hidden rounded-xl bg-gray-800">
                <img
                  src={video.thumbnail || "https://via.placeholder.com/640x360?text=No+Thumbnail"}
                  alt={video.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Duration */}
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration ? `${Math.floor(video.duration / 60)}:${("0" + Math.floor(video.duration % 60)).slice(-2)}` : "0:00"}
                </span>
              </div>
              
              {/* Video Info */}
              <div className="flex gap-3">
                {/* Avatar */}
                <Link 
                  to={`/user/${video.owner?.username}/videos`}
                  className="flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={video.owner?.avatar || "/default-avatar.png"}
                    alt={video.owner?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
                
                {/* Title and Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {video.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 mb-1">
                    {video.owner?.username}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <span>{video.views || 0} views</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
        
        {/* Show message if no published videos */}
        {publishedVideos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No videos available</h3>
            <p className="text-gray-500 text-center">Check back later for new content!</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default VideoGrid;
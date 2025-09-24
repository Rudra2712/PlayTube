import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getVideo, getAllVideos } from "../../app/Slices/videoSlice";
import { addToHistory } from "../../app/Slices/historySlice.js";
import { toggleVideoLike, getVideoLikeStatus, clearLikeStatus } from "../../app/Slices/likeSlice.js";
import VideoList from "../Video/VideoList.jsx";
import CommentsSection from "../Comment/CommentSection.jsx";

const VideoDetail = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const hasAddedToHistory = useRef(false);

  const { video, videos, loading, error } = useSelector((state) => state.video);
  const { 
    loading: likeLoading, 
    likeStatus: { isLiked, likesCount, loading: likeStatusLoading } 
  } = useSelector((state) => state.like);

  // Fetch video like status when video loads
  useEffect(() => {
    if (videoId) {
      dispatch(getVideoLikeStatus(videoId));
    }
    
    return () => {
      // Clear like status when component unmounts or videoId changes
      dispatch(clearLikeStatus());
    };
  }, [videoId, dispatch]);

  // Add to history when video is loaded
  useEffect(() => {
    if (video?._id && !hasAddedToHistory.current) {
      dispatch(addToHistory(video._id));
      hasAddedToHistory.current = true;
    }
  }, [video?._id, dispatch]);

  // Reset history flag when videoId changes
  useEffect(() => {
    hasAddedToHistory.current = false;
  }, [videoId]);

  // Fetch video and all suggestions
  useEffect(() => {
    if (videoId) {
      dispatch(getVideo(videoId));
      dispatch(getAllVideos());
    }
  }, [videoId, dispatch]);

  // Handle play event
  const handleVideoPlay = () => {
    if (video?._id && !hasAddedToHistory.current) {
      dispatch(addToHistory(video._id));
      hasAddedToHistory.current = true;
    }
  };

  const handleToggleLike = async () => {
    if (!video?._id) return;
    dispatch(toggleVideoLike(video._id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!video) return <p>No video found</p>;

  // Random suggestions excluding current video
  const suggestions = videos
    ?.filter((vid) => vid._id !== video._id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          {/* Video Player */}
          <div className="mb-4">
            <video
              src={video.videoFile}
              controls
              className="w-full max-h-[500px] rounded-lg"
              onPlay={handleVideoPlay}
              onLoadedData={() => {
                if (video?._id && !hasAddedToHistory.current) {
                  dispatch(addToHistory(video._id));
                  hasAddedToHistory.current = true;
                }
              }}
            />
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-3 text-white">
              {video.title}
            </h1>

            <div className="flex items-center justify-between mb-4">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <Link to={`/user/${video.owner?.username}/videos`}>
                  <img
                    src={video.owner?.avatar || "/default-avatar.png"}
                    alt={video.owner?.username}
                    className="w-12 h-12 rounded-full"
                  />
                </Link>
                <div>
                  <h3 className="font-semibold text-white">
                    {video.owner?.fullName || video.owner?.username}
                  </h3>
                  <p className="text-sm text-gray-400">
                    @{video.owner?.username}
                  </p>
                </div>
              </div>

              {/* Views, Date & Like Button */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>

                {/* Like Button */}
                <button
                  onClick={handleToggleLike}
                  disabled={likeLoading || likeStatusLoading}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition ${
                    isLiked
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  } ${(likeLoading || likeStatusLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {likeStatusLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      {isLiked ? "❤️ Liked" : "🤍 Like"} {likesCount}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Video Description */}
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-300 whitespace-pre-wrap">
                {video.description}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <CommentsSection videoId={videoId} />
        </main>

        {/* Suggestions Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white mb-2">
            Suggested Videos
          </h2>
          {suggestions && suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((sug) => (
                <VideoList key={sug._id} video={sug} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No suggestions available</p>
          )}
        </aside>
      </div>
    </section>
  );
};

export default VideoDetail;
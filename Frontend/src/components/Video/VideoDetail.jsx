import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";
import { addToHistory } from "../../app/Slices/historySlice.js";
import {
  toggleVideoLike,
  getVideoLikeStatus,
  clearLikeStatus,
} from "../../app/Slices/likeSlice.js";
import VideoList from "../Video/VideoList.jsx";
import CommentsSection from "../Comment/CommentSection.jsx";
import { getVideo, getAllVideos, updateView } from "../../app/Slices/videoSlice";

const VideoDetail = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const hasCountedView = useRef(false);

  const { video, videos, loading, error } = useSelector((state) => state.video);
  const {
    loading: likeLoading,
    likeStatus: { isLiked, likesCount, loading: likeStatusLoading },
  } = useSelector((state) => state.like);

  // Check if user came from internal navigation (not refresh)
  const cameFromInternalLink = () => {
    // If there's navigation history or referrer is our own site
    return location.state?.fromInternalNav || 
           document.referrer.includes(window.location.origin);
  };

  // Fetch video data & like status
  useEffect(() => {
    if (!videoId) return;
    
    dispatch(getVideo(videoId));
    dispatch(getAllVideos());
    dispatch(getVideoLikeStatus(videoId));

    return () => {
      dispatch(clearLikeStatus());
    };
  }, [videoId, dispatch]);

  // Count view only for intentional navigation
  useEffect(() => {
    if (video?._id && !hasCountedView.current && cameFromInternalLink()) {
      hasCountedView.current = true;
      dispatch(updateView(video._id));
      dispatch(addToHistory(video._id));
    }
  }, [video, dispatch, location]);

  const handleToggleLike = () => {
    if (!video?._id) return;
    dispatch(toggleVideoLike(video._id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!video) return <p>No video found</p>;

  const suggestions = videos
    ?.filter((vid) => 
      // Filter out current video AND unpublished videos
      vid._id !== video._id && vid.isPublished !== false
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        <main className="flex-1 max-w-4xl">
          {/* Video Player */}
          <div className="mb-4">
            <video
              key={video._id}
              src={video.videoFile}
              controls
              className="w-full max-h-[500px] rounded-lg"
            />
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-3 text-white">{video.title}</h1>

            <div className="flex items-center justify-between mb-4">
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
                  <p className="text-sm text-gray-400">@{video.owner?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>

                <button
                  onClick={handleToggleLike}
                  disabled={likeLoading || likeStatusLoading}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition ${
                    isLiked ? "bg-red-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  } ${likeLoading || likeStatusLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {likeStatusLoading ? "Loading..." : (<>{isLiked ? "❤️ Liked" : "🤍 Like"} {likesCount}</>)}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>

          <CommentsSection videoId={videoId} />
        </main>

        {/* Suggestions Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white mb-2">Suggested Videos</h2>
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
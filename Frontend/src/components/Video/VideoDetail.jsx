import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVideo, getAllVideos } from "../../app/Slices/videoSlice";
import { addToHistory } from "../../app/Slices/historySlice.js";
import VideoList from "../Video/VideoList.jsx";
import CommentsSection from "../Comment/CommentSection.jsx";
import { Link } from "react-router-dom";
const VideoDetail = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const hasAddedToHistory = useRef(false);

  const { video, videos, loading, error } = useSelector((state) => state.video);

  // Add to history when video is loaded and ready to play
  useEffect(() => {
    if (video?._id && !hasAddedToHistory.current) {
      // console.log("Adding video to history:", video._id);
      dispatch(addToHistory(video._id));
      hasAddedToHistory.current = true;
    }
  }, [video?._id, dispatch]);

  // Reset the history flag when videoId changes
  useEffect(() => {
    hasAddedToHistory.current = false;
  }, [videoId]);

  // Fetch video data
  useEffect(() => {
    if (videoId) {
      dispatch(getVideo(videoId));
      dispatch(getAllVideos()); // fetch all for suggestions
    }
  }, [videoId, dispatch]);

  // Handle video play event to ensure it's added to history
  const handleVideoPlay = () => {
    if (video?._id && !hasAddedToHistory.current) {
      console.log("Video started playing, adding to history:", video._id);
      dispatch(addToHistory(video._id));
      hasAddedToHistory.current = true;
    }
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
                // Alternative trigger point - when video is loaded and ready
                if (video?._id && !hasAddedToHistory.current) {
                  console.log("Video loaded, adding to history:", video._id);
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

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
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

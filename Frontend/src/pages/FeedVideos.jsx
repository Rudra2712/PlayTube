import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../app/Slices/videoSlice";
import { VideoGrid } from "../components/index";
import ComponentLoader from "../components/Loading/ComponentLoader";

function FeedVideos() {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(getAllVideos());
  }, [dispatch]);

  if (loading) {
    return <ComponentLoader message="Loading videos..." fullHeight />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Failed to load videos</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => dispatch(getAllVideos())}
            className="px-4 py-2 bg-[#ae7aff] text-black rounded-lg hover:bg-[#9c6ae6] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <VideoGrid videos={videos || []} />;
}

export default FeedVideos;

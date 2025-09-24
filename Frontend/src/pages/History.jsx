import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  fetchHistory,
  clearError,
  removeHistoryItem,
  clearHistory,
} from "../app/Slices/historySlice";

function History() {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.history);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // console.log("Redux history state:", history);
    // console.log("History loading:", loading);
    // console.log("History error:", error);
  }, [history, loading, error]);

  useEffect(() => {
    dispatch(fetchHistory());

    // Clear any existing errors when component mounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Error loading history: {error}</p>
        <button
          onClick={() => dispatch(fetchHistory())}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Watch History</h2>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No recent history</p>
            <p className="text-sm text-gray-500">
              Videos you watch will appear here
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Watch History</h2>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            {history.length} video{history.length !== 1 ? "s" : ""} in history
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1 bg-red-600 text-sm text-white rounded hover:bg-red-700"
          >
            Clear All History
          </button>
        </div>
        {history
          .map((item, index) => {
            // Handle case where video might not be populated
            if (!item.video || typeof item.video === "string") {
              console.warn(
                `Video not populated for history item ${index}:`,
                item
              );
              return null;
            }

            const video = item.video;

            return (
              <Link
                key={item._id || `${video._id}-${item.watchedAt}`}
                to={`/video/${video._id}`}
                className="w-full max-w-3xl gap-x-4 md:flex hover:bg-gray-800 transition-colors rounded-lg p-2"
              >
                <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                  <div className="w-full pt-[56%]">
                    <div className="absolute inset-0">
                      <img
                        src={video.thumbnail || "/default-thumbnail.png"}
                        alt={video.title || "Video thumbnail"}
                        className="h-full w-full object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/default-thumbnail.png";
                        }}
                      />
                    </div>
                    {video.duration && (
                      <span className="absolute bottom-1 right-1 inline-block rounded bg-black bg-opacity-75 px-1.5 py-0.5 text-sm text-white">
                        {Math.floor(video.duration / 60)}:
                        {("0" + Math.floor(video.duration % 60)).slice(-2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-x-2 md:w-7/12">
                  <div className="h-10 w-10 shrink-0 md:hidden">
                    <img
                      src={video.owner?.avatar || "/default-avatar.png"}
                      alt={video.owner?.username || "User avatar"}
                      className="h-full w-full rounded-full"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </div>

                  <div className="w-full">
                    <h6 className="mb-1 font-semibold md:max-w-[75%] line-clamp-2">
                      {video.title || "Untitled Video"}
                    </h6>

                    <p className="flex text-sm text-gray-200 sm:mt-3">
                      {video.views || 0} Views ·{" "}
                      {video.createdAt
                        ? new Date(video.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </p>

                    <div className="flex items-center gap-x-4">
                      <div className="mt-2 hidden h-10 w-10 shrink-0 md:block">
                        <Link to={`/user/${video.owner?.username}/videos`}>
                          <img
                            src={video.owner?.avatar || "/default-avatar.png"}
                            alt={video.owner?.username || "User avatar"}
                            className="h-full w-full rounded-full"
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                        </Link>
                      </div>
                      <p className="text-sm text-gray-200">
                        {video.owner?.username || "Unknown creator"}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      Watched {new Date(item.watchedAt).toLocaleDateString()} at{" "}
                      {new Date(item.watchedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {video.description && (
                      <p className="mt-2 hidden text-sm text-gray-300 md:block line-clamp-2">
                        {video.description.slice(0, 100)}
                        {video.description.length > 100 && "..."}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="ml-auto self-start rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 md:mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(removeHistoryItem(video._id));
                  }}
                >
                  Remove
                </button>
              </Link>
            );
          })
          .filter(Boolean)}{" "}
        {/* Remove any null items */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                Clear Watch History
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to clear your entire watch history? This
                action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    dispatch(clearHistory());
                    setShowConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default History;

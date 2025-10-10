import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../app/Slices/tweetSlice";
import { toggleTweetLike } from "../app/Slices/likeSlice";

function AllTweets() {
  const dispatch = useDispatch();
  const { data: tweets, loading } = useSelector((state) => state.tweet);
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllTweets());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading tweets...</p>;
  }

  if (!tweets || tweets.length === 0) {
    return <p className="text-center text-gray-400">No tweets available</p>;
  }

  const handleLike = (tweetId) => {
    dispatch(toggleTweetLike(tweetId));

  };

  return (
    <div className="w-full p-4">
      {/* Sticky Header */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800 sticky top-0 bg-white p-2 border-b">
        All Tweets
      </h2>

      <div>
        {tweets.map((tweet) => (
          <div
            key={tweet._id}
            className="w-full border-b p-4"
          >
            {/* Tweet Header */}
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-white">
                @{tweet.owner?.username}
              </p>
              {tweet.owner?._id === userData?._id && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>

            {/* Tweet Content */}
            <p className="text-white mb-3">{tweet.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(tweet._id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
              >
                👍 <span>{tweet.likesCount || 0}</span>
              </button>

              {/* Optional: Timestamp if available */}
              {tweet.createdAt && (
                <span className="text-xs text-gray-400">
                  {new Date(tweet.createdAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllTweets;

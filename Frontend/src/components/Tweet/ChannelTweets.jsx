// components/ChannelTweets.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTweet } from "../../app/Slices/tweetSlice";
import { axiosInstance } from "../../helpers/axios.helper";
import { toggleTweetLike } from "../../app/Slices/likeSlice";

function ChannelTweets() {
  const { username } = useParams(); // e.g. /user/oney/tweets → "oney"
  const dispatch = useDispatch();
  const { data: tweets = [], loading } = useSelector((state) => state.tweet);

  const [userId, setUserId] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Step 1: Resolve username → userId
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        setUserLoading(true);
        const res = await axiosInstance.get(`/users/c/${username}`);
        setUserId(res.data.data._id);
      } catch (err) {
        console.error("Failed to fetch user by username:", err);
      } finally {
        setUserLoading(false);
      }
    };

    if (username) fetchUserId();
  }, [username]);

  // Step 2: Fetch tweets by userId
  useEffect(() => {
    if (userId) {
      dispatch(getTweet(userId));
    }
  }, [dispatch, userId]);

  const handleLike = (tweetId) => {
    dispatch(toggleTweetLike(tweetId));
  };

  if (userLoading || loading)
    return <p className="text-gray-400">Loading tweets...</p>;

  return (
    <div className="py-4">
      {tweets.length === 0 ? (
        <p className="text-gray-400 text-center py-6">
          No tweets yet from <span className="font-semibold">@{username}</span>.
        </p>
      ) : (
        tweets.map((tweet) => (
          <div
            key={tweet._id}
            className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent"
          >
            <div className="h-14 w-14 shrink-0">
              <img
                src={tweet.owner?.avatar || "https://via.placeholder.com/150"}
                alt={tweet.owner?.username || "User"}
                className="h-full w-full rounded-full"
              />
            </div>

            <div className="w-full">
              <h4 className="mb-1 flex items-center gap-x-2">
                <span className="font-semibold">{tweet.owner?.fullName}</span>
                <span className="inline-block text-sm text-gray-400">
                  @{tweet.owner?.username}
                </span>
                <span className="inline-block text-sm text-gray-400">
                  • {new Date(tweet.createdAt).toLocaleString()}
                </span>
              </h4>
              <p className="mb-2">{tweet.content}</p>

              {/* 👍 Like button */}
              <button
                onClick={() => handleLike(tweet._id)}
                className="mt-1 text-blue-400 hover:underline"
              >
                👍 {tweet.likesCount || 0}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ChannelTweets;

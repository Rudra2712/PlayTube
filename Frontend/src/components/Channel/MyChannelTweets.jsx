// components/MyChannelTweets.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTweet,
  getTweet,
  deleteTweet,
  updateTweet,
} from "../../app/Slices/tweetSlice";
import { toggleTweetLike } from "../../app/Slices/likeSlice";

function MyChannelTweets() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth?.userData);
  const userId = loggedInUser?._id;

  const { data: tweets = [], loading } = useSelector((state) => state.tweet);

  const [content, setContent] = useState("");
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Load tweets for logged-in user
  useEffect(() => {
    if (userId) {
      dispatch(getTweet(userId));
    }
  }, [dispatch, userId]);

  const handleCreateTweet = async () => {
    if (!content.trim() || !userId) return;
    try {
      await dispatch(createTweet({ content })).unwrap();
      await dispatch(getTweet(userId)).unwrap();
      setContent("");
    } catch (err) {
      console.error("create tweet failed:", err);
    }
  };

  const handleDelete = async (tweetId) => {
    try {
      await dispatch(deleteTweet(tweetId)).unwrap();
      await dispatch(getTweet(userId)).unwrap();
    } catch (err) {
      console.error("delete tweet failed:", err);
    }
  };

  const handleUpdate = async (tweetId) => {
    if (!editContent.trim()) return;
    try {
      await dispatch(updateTweet({ tweetId, data: { content: editContent } })).unwrap();
      await dispatch(getTweet(userId)).unwrap();
      setEditingTweetId(null);
      setEditContent("");
    } catch (err) {
      console.error("update tweet failed:", err);
    }
  };

  const handleLike = (tweetId) => {
    dispatch(toggleTweetLike(tweetId));
  };

  if (!userId) {
    return <p className="text-gray-400 text-center py-6">Please log in to view your tweets.</p>;
  }

  if (loading) return <p className="text-gray-400">Loading tweets...</p>;

  const tweetList = Array.isArray(tweets) ? tweets : [];

  return (
    <>
      {/* Composer */}
      <div className="mt-2 border pb-2">
        <textarea
          className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
          placeholder="Write a tweet"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-end gap-x-3 px-3">
          <button
            onClick={handleCreateTweet}
            className="bg-[#ae7aff] px-3 py-2 font-semibold text-black"
          >
            Send
          </button>
        </div>
      </div>

      {/* List */}
      <div className="py-4">
        {tweetList.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No tweets yet. Start by writing one above! 🚀
          </p>
        ) : (
          tweetList.map((tweet) => (
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
                    {new Date(tweet.createdAt).toLocaleString()}
                  </span>
                </h4>

                {editingTweetId === tweet._id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full resize-none border p-2 text-black"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleUpdate(tweet._id)}
                        className="bg-green-500 px-2 py-1 text-sm text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTweetId(null)}
                        className="bg-gray-500 px-2 py-1 text-sm text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mb-2">{tweet.content}</p>
                )}

                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => {
                      setEditingTweetId(tweet._id);
                      setEditContent(tweet.content);
                    }}
                    className="text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tweet._id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                  {/* 👍 Like button */}
                  <button
                    onClick={() => handleLike(tweet._id)}
                    className="text-blue-400"
                  >
                    👍 {tweet.likesCount || 0}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyChannelTweets;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../app/Slices/commentSlice";

const CommentForm = ({ videoId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  // safe selector fallback
  const { adding = false, error: addError = null } =
    useSelector((state) => state.comments) || {};

  const { userData: user } = useSelector((state) => state.auth) || {};

//   console.log("User in CommentForm:", user);
  //   const wholeState = useSelector((state) => state);
  //   console.log("Redux state:", wholeState);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await dispatch(addComment({ videoId, content: content.trim() })).unwrap();
      setContent("");
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };
  //   console.log('User in CommentForm:', user);
  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <p className="text-gray-400">Please log in to add a comment.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex gap-3">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.username}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              disabled={adding}
            />
          </div>

          {addError && (
            <div className="mb-3 text-sm text-red-400">{addError}</div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setContent("")}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              disabled={adding}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || adding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {adding ? "Posting..." : "Comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentForm;

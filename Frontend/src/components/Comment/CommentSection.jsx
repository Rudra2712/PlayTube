import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoComments,
  resetComments,
} from "../../app/Slices/commentSlice";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { MessageCircle, ChevronDown } from "lucide-react";

const CommentsSection = ({ videoId }) => {
  const dispatch = useDispatch();

  // Safe destructuring with defaults
  const {
    comments = [],
    loading = false,
    error = null,
    pagination = {},
  } = useSelector((state) => state.comments) || {};

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoComments({ videoId, page: 1 }));
    }
    return () => {
      dispatch(resetComments());
    };
  }, [dispatch, videoId]);

  const handleLoadMore = () => {
    if (pagination?.hasNextPage && !loading) {
      dispatch(
        fetchVideoComments({
          videoId,
          page: (pagination.currentPage || 1) + 1,
        })
      );
    }
  };

  const handleCommentAdded = () => {
    // refresh first page after adding
    dispatch(fetchVideoComments({ videoId, page: 1 }));
  };

  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Failed to load comments: {error}</p>
          <button
            onClick={() => dispatch(fetchVideoComments({ videoId, page: 1 }))}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle size={24} className="text-gray-400" />
        <h3 className="text-xl font-semibold text-white">Comments</h3>
        <span className="text-gray-400">
          ({pagination?.totalComments || 0})
        </span>
      </div>

      <CommentForm videoId={videoId} onCommentAdded={handleCommentAdded} />

      <div className="space-y-0">
        {comments.length === 0 && !loading ? (
          <div className="text-center py-8">
            <MessageCircle size={48} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg mb-2">No comments yet</p>
            <p className="text-gray-500">
              Be the first to comment on this video!
            </p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}

            {pagination?.hasNextPage && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown size={16} />
                  {loading ? "Loading..." : "Load More Comments"}
                </button>
              </div>
            )}

            {loading && comments.length === 0 && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;

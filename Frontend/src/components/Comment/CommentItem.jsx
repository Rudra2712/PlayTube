import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateComment, deleteComment, toggleCommentLike } from '../../app/Slices/commentSlice';
import { Edit2, Trash2, MoreVertical, Check, X, Heart } from 'lucide-react';

const CommentItem = ({ comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);

  const dispatch = useDispatch();

  // Safe destructuring from Redux
  const { updating = {}, deleting = {}, liking = {} } = useSelector((state) => state.comments) || {};
  const { userData: user } = useSelector((state) => state.auth) || {};

  const isOwner = user?._id && comment?.owner?._id && user._id === comment.owner._id;
  const isUpdating = !!updating[comment._id];
  const isDeleting = !!deleting[comment._id];
  const isLiking = !!liking[comment._id];

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      await dispatch(updateComment({ commentId: comment._id, content: editContent.trim() })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    
    try {
      await dispatch(deleteComment(comment._id)).unwrap();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      await dispatch(toggleCommentLike(comment._id)).unwrap();
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="flex gap-3 py-4 border-b border-gray-700 last:border-b-0 relative">
      {/* Avatar */}
      <img
        src={comment.owner?.avatar || '/default-avatar.png'}
        alt={comment.owner?.username || 'User avatar'}
        className="w-10 h-10 rounded-full flex-shrink-0"
      />

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-white">
            {comment.owner?.fullName || comment.owner?.username || 'Unknown'}
          </span>
          <span className="text-sm text-gray-400">{formatDate(comment.createdAt)}</span>
          {comment.updatedAt !== comment.createdAt && (
            <span className="text-xs text-gray-500">(edited)</span>
          )}
        </div>

        {/* Editable or static comment */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              disabled={isUpdating}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={!editContent.trim() || isUpdating}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <Check size={16} /> {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-gray-200 whitespace-pre-wrap break-words">{comment.content}</div>
            
            {/* Like button */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={handleLike}
                disabled={isLiking || !user}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  comment.isLiked 
                    ? 'text-red-500 hover:text-red-400' 
                    : 'text-gray-400 hover:text-red-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Heart 
                  size={16} 
                  className={comment.isLiked ? 'fill-current' : ''} 
                />
                <span>{comment.likesCount || 0}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Dropdown for owner only */}
      {isOwner && !isEditing && (
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            disabled={isDeleting}
          >
            <MoreVertical size={16} />
          </button>

          {showActions && (
            <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 min-w-[140px]">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 first:rounded-t-lg"
                disabled={isUpdating || isDeleting}
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700 last:rounded-b-lg"
                disabled={isUpdating || isDeleting}
              >
                <Trash2 size={14} /> {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}

          {/* Click outside closes dropdown */}
          {showActions && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowActions(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

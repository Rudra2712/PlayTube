import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axios.helper";

// Fetch comments for a video
export const fetchVideoComments = createAsyncThunk(
  "comments/fetchVideoComments",
  async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/comments/${videoId}?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

// Add a new comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/comments/${videoId}`, {
        content,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

// Update a comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/comments/c/${commentId}`, {
        content,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/comments/c/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

// Toggle comment like
export const toggleCommentLike = createAsyncThunk(
  "comments/toggleCommentLike",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
      return { commentId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle comment like"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalComments: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10,
    },
    loading: false,
    adding: false,
    addError: null,
    updating: {},
    deleting: {},
    liking: {},
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetComments: (state) => {
      state.comments = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalComments: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10,
      };
    },
    setUpdating: (state, action) => {
      const { commentId, status } = action.payload;
      state.updating[commentId] = status;
    },
    setDeleting: (state, action) => {
      const { commentId, status } = action.payload;
      state.deleting[commentId] = status;
    },
    setLiking: (state, action) => {
      const { commentId, status } = action.payload;
      state.liking[commentId] = status;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchVideoComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoComments.fulfilled, (state, action) => {
        state.loading = false;
        const { comments, pagination } = action.payload;

        if (pagination.currentPage === 1) {
          // Replace comments for first page
          state.comments = comments;
        } else {
          // Append comments for subsequent pages
          state.comments = [...state.comments, ...comments];
        }

        state.pagination = pagination;
        state.error = null;
      })
      .addCase(fetchVideoComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add comment
      .addCase(addComment.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.adding = false;
        state.comments.unshift(action.payload);
        state.pagination.totalComments += 1;
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload;
      })

      // Update comment
      .addCase(updateComment.pending, (state, action) => {
        const commentId = action.meta.arg.commentId;
        state.updating[commentId] = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.comments.findIndex(
          (c) => c._id === updatedComment._id
        );
        if (index !== -1) {
          state.comments[index] = updatedComment;
        }
        state.updating[updatedComment._id] = false;
        state.error = null;
      })
      .addCase(updateComment.rejected, (state, action) => {
        const commentId = action.meta.arg.commentId;
        state.updating[commentId] = false;
        state.error = action.payload;
      })

      // Delete comment
      .addCase(deleteComment.pending, (state, action) => {
        const commentId = action.meta.arg;
        state.deleting[commentId] = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        state.comments = state.comments.filter((c) => c._id !== commentId);
        state.pagination.totalComments -= 1;
        state.deleting[commentId] = false;
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        const commentId = action.meta.arg;
        state.deleting[commentId] = false;
        state.error = action.payload;
      })

      // Toggle comment like
      .addCase(toggleCommentLike.pending, (state, action) => {
        const commentId = action.meta.arg;
        state.liking[commentId] = true;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, isLiked, likesCount } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.isLiked = isLiked;
          comment.likesCount = likesCount;
        }
        state.liking[commentId] = false;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        const commentId = action.meta.arg;
        state.liking[commentId] = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetComments, setUpdating, setDeleting, setLiking } =
  commentSlice.actions;
export default commentSlice.reducer;

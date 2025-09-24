import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { axiosInstance } from "../../helpers/axios.helper";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: [],
  likeStatus: {
    loading: false,
    isLiked: false,
    likesCount: 0,
    likeId: null,
  },
};

export const getLikedVideos = createAsyncThunk(
  "like/getLikedVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/likes/videos`);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
      return rejectWithValue(parseErrorMessage(error.response?.data));
    }
  }
);

export const getVideoLikeStatus = createAsyncThunk(
  "like/getVideoLikeStatus",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/likes/status/${videoId}`);
      return response.data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(parseErrorMessage(error.response?.data));
    }
  }
);
export const getTweetLikeStatus = createAsyncThunk(
  "like/getTweetLikeStatus",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/likes/status/t/${tweetId}`);
      return { tweetId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error.response?.data));
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "like/toggleCommentLike",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
      return rejectWithValue(parseErrorMessage(error.response?.data));
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  "like/toggleTweetLike",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
      return rejectWithValue(parseErrorMessage(error.response?.data));
    }
  }
);

export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike",
  async (videoId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      toast.success(response.data.message);
      dispatch(getVideoLikeStatus(videoId));
      dispatch(getLikedVideos());
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
      return rejectWithValue(parseErrorMessage(error.response?.data));
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    clearLikeStatus: (state) => {
      state.likeStatus = {
        loading: false,
        isLiked: false,
        likesCount: 0,
        likeId: null,
      };
    },
  },
  extraReducers: (builder) => {
    // get Liked Videos
    builder.addCase(getLikedVideos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLikedVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload || [];
      state.status = true;
    });
    builder.addCase(getLikedVideos.rejected, (state) => {
      state.loading = false;
      state.status = false;
      state.data = [];
    });

    // get Video Like Status
    builder.addCase(getVideoLikeStatus.pending, (state) => {
      state.likeStatus.loading = true;
    });
    builder.addCase(getVideoLikeStatus.fulfilled, (state, action) => {
      state.likeStatus.loading = false;
      state.likeStatus.isLiked = action.payload.isLiked;
      state.likeStatus.likesCount = action.payload.likesCount;
      state.likeStatus.likeId = action.payload.likeId;
    });
    builder.addCase(getVideoLikeStatus.rejected, (state) => {
      state.likeStatus.loading = false;
      state.likeStatus.isLiked = false;
      state.likeStatus.likesCount = 0;
      state.likeStatus.likeId = null;
    });
    builder.addCase(getTweetLikeStatus.fulfilled, (state, action) => {
      const { tweetId, isLiked, likesCount, likeId } = action.payload;
      // Attach like info to each tweet in state.data
      state.data = state.data.map((tweet) =>
        tweet._id === tweetId
          ? { ...tweet, likeStatus: { isLiked, likesCount, likeId } }
          : tweet
      );
    });

    // toggle Comment Like
    builder.addCase(toggleCommentLike.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleCommentLike.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
    });
    builder.addCase(toggleCommentLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle TweetLike
    builder.addCase(toggleTweetLike.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleTweetLike.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
    });
    builder.addCase(toggleTweetLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle Video Like
    builder.addCase(toggleVideoLike.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleVideoLike.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
    });
    builder.addCase(toggleVideoLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export const { clearLikeStatus } = likeSlice.actions;
export default likeSlice.reducer;

import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axios.helper";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  videos: [], // 👈 all videos here
  video: null, // single video details
  error: null,
};

export const publishVideo = createAsyncThunk(
  "video/publishVideo",
  async ({ data }, { rejectWithValue }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      if (data.videoFile && data.videoFile[0]) {
        formData.append("videoFile", data.videoFile[0]);
      }

      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const response = await axiosInstance.post(`/videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response?.data));
      console.log(error);
      return rejectWithValue(
        parseErrorMessage(error.response?.data || error.message)
      );
    }
  }
);

export const getVideo = createAsyncThunk("video/getVideo", async (videoId) => {
  try {
    const response = await axiosInstance.get(`/videos/${videoId}`);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
  }
});

export const getAllVideos = createAsyncThunk(
  "video/getAllVideos",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { userId, username, page = 1, limit = 10 } = params;

      // Build query string dynamically
      let url = `/videos?page=${page}&limit=${limit}`;
      if (userId) url += `&userId=${userId}`;
      if (username) url += `&username=${username}`;

      // console.log("Fetching videos from:", url); // 🔍 Debug log

      const response = await axiosInstance.get(url);
      return response.data.data; // 👈 your backend wraps videos in `data`
    } catch (error) {
      return rejectWithValue(
        parseErrorMessage(error.response?.data || error.message)
      );
    }
  }
);

export const updateVideo = createAsyncThunk(
  "video/updateVideo",
  async ({ videoId, data }) => {
    try {
      let requestData;

      // Build FormData only if thumbnail is a File
      if (data.thumbnail instanceof File) {
        requestData = new FormData();
        if (data.title) requestData.append("title", data.title);
        if (data.description)
          requestData.append("description", data.description);
        requestData.append("thumbnail", data.thumbnail);
      } else {
        requestData = {
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
        };
      }
      if (requestData instanceof FormData) {
        for (let pair of requestData.entries()) {
          console.log(pair[0], pair[1]);
        }
      } else {
        console.log("Sending JSON:", requestData);
      }
      const isFormData = data instanceof FormData;

      const response = await axiosInstance.patch(
        `/videos/${videoId}`,
        requestData,
        {
          headers:
            requestData instanceof FormData
              ? { "Content-Type": "multipart/form-data" }
              : { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response?.data));
      throw error;
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "video/deleteVideo",
  async (videoId) => {
    try {
      const response = await axiosInstance.delete(`/videos/${videoId}`);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
    }
  }
);

export const togglePublish = createAsyncThunk(
  "video/togglePublish",
  async (videoId) => {
    try {
      // THINKME : how it will work
      const response = await axiosInstance.patch(
        `/videos/toggle/publish/${videoId}`
      );
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
    }
  }
);

export const updateView = createAsyncThunk(
  "video/updateView",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/videos/${videoId}/view`);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Error updating view:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        parseErrorMessage(error.response?.data || error.message)
      );
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    // ...other reducers
    setVideos: (state, action) => {
      state.videos = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Get video
    builder.addCase(getVideo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.video = action.payload;
      state.status = true;
    });
    builder.addCase(getVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch video";
      state.status = false;
    });

    // Publish video
    builder.addCase(publishVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(publishVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.video = action.payload;
      // Add the new video to the videos array
      if (action.payload) {
        state.videos.unshift(action.payload);
      }
      state.status = true;
    });
    builder.addCase(publishVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to upload video";
      state.status = false;
    });

    // Get All videos
    builder.addCase(getAllVideos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.videos = action.payload.videos; // ✅ store in videos
      state.status = true;
    });
    builder.addCase(getAllVideos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch videos";
      state.status = false;
    });

    // delete video
    builder.addCase(deleteVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.video = null;
      state.status = true;
    });
    builder.addCase(deleteVideo.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // update video
    builder.addCase(updateVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.video = action.payload;
      state.status = true;
    });
    builder.addCase(updateVideo.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle Publish video
    builder.addCase(togglePublish.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(togglePublish.fulfilled, (state, action) => {
      state.loading = false;
      // Update the specific video in the videos array
      if (action.payload) {
        const index = state.videos.findIndex(
          (video) => video._id === action.payload._id
        );
        if (index !== -1) {
          state.videos[index] = action.payload;
        }
      }
    });
    builder.addCase(togglePublish.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to toggle publish status";
    });

    // update view
    builder.addCase(updateView.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateView.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      if (state.video && state.video._id === action.payload._id) {
        state.video = action.payload;
      }
      state.videos = state.videos.map((v) =>
        v._id === action.payload._id ? action.payload : v
      );
    });

    builder.addCase(updateView.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export const { setVideos } = videoSlice.actions;

export default videoSlice.reducer;

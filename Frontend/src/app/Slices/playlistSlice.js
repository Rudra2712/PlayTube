import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { axiosInstance } from "../../helpers/axios.helper";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: null,           // used for user playlists (array)
  singlePlaylist: null, // used for getPlaylistById (object)
};


export const getPlaylistById = createAsyncThunk(
  "playlist/getPlaylistById", 
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      const msg = parseErrorMessage(error.response?.data);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const getUserPlaylists = createAsyncThunk(
  "playlist/getUserPlaylists",
  async (userId, { rejectWithValue }) => {
    try {
      // console.log("📡 Fetching playlists for userId:", userId);
      const response = await axiosInstance.get(`/playlist/user/${userId}`);
      // console.log("✅ getUserPlaylists API response:", response.data);
      return response.data.data;
    } catch (error) {
      const msg = parseErrorMessage(error.response?.data);
      toast.error(msg);
      console.error("❌ getUserPlaylists error:", msg);
      return rejectWithValue(msg);
    }
  }
);

export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist", 
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/playlist`, data);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      const msg = parseErrorMessage(error.response?.data);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideoToPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/playlist/add/${videoId}/${playlistId}`);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      const msg = parseErrorMessage(error.response?.data);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideoFromPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      const msg = parseErrorMessage(error.response?.data);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlist/updatePlaylist",
  async ({ playlistId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/playlist/${playlistId}`, data);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      const msg = parseErrorMessage(error.response?.data);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist", 
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/playlist/${playlistId}`);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      const msg = parseErrorMessage(error.response?.data);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  extraReducers: (builder) => {
    // get Playlist By Id
    builder.addCase(getPlaylistById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPlaylistById.fulfilled, (state, action) => {
      state.loading = false;
      state.singlePlaylist = action.payload;
      state.status = true;
    });
    builder.addCase(getPlaylistById.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // get User Playlists
    builder.addCase(getUserPlaylists.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserPlaylists.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(getUserPlaylists.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // create Playlist
    builder.addCase(createPlaylist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPlaylist.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(createPlaylist.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // add Video To Playlist
    builder.addCase(addVideoToPlaylist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addVideoToPlaylist.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(addVideoToPlaylist.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // remove Video From Playlist
    builder.addCase(removeVideoFromPlaylist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(removeVideoFromPlaylist.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // update Playlist
    builder.addCase(updatePlaylist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePlaylist.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(updatePlaylist.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // delete Playlist
    builder.addCase(deletePlaylist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePlaylist.fulfilled, (state, action) => {
      state.loading = false;
      state.data = null;
      state.status = true;
    });
    builder.addCase(deletePlaylist.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export default playlistSlice.reducer;
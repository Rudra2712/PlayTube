import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { axiosInstance } from "../../helpers/axios.helper";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: [],
};

export const getAllTweets = createAsyncThunk("tweet/getAllTweets", async () => {
  try {
    const response = await axiosInstance.get(`/tweets/all`);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response?.data));
    console.log(error);
  }
});

export const createTweet = createAsyncThunk(
  "tweet/createTweet",
  async (data) => {
    try {
      const response = await axiosInstance.post(`/tweets`, data);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
    }
  }
);

export const getTweet = createAsyncThunk("tweet/getTweet", async (userId) => {
  try {
    const response = await axiosInstance.get(`/tweets/user/${userId}`);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
  }
});

export const updateTweet = createAsyncThunk(
  "tweet/updateTweet",
  async ({ tweetId, data }) => {
    try {
      const response = await axiosInstance.patch(`/tweets/${tweetId}`, data);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
      throw error; // so .unwrap() in component can catch it
    }
  }
);

export const deleteTweet = createAsyncThunk(
  "tweet/deleteTweet",
  async (tweetId) => {
    try {
      const response = await axiosInstance.delete(`/tweets/${tweetId}`);
      toast.success(response.data.message);
      return { tweetId }; // pass back the id so reducer can remove it
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      console.log(error);
      throw error;
    }
  }
);

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  extraReducers: (builder) => {
    // create tweet
    builder.addCase(createTweet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTweet.fulfilled, (state, action) => {
      state.loading = false;
      // append new tweet to the array
      state.data = state.data
        ? [action.payload, ...state.data]
        : [action.payload];
      state.status = true;
    });
    builder.addCase(createTweet.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // get User tweet
    builder.addCase(getTweet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTweet.fulfilled, (state, action) => {
      state.loading = false;
      state.data = Array.isArray(action.payload) ? action.payload : [];
      state.status = true;
    });
    builder.addCase(getTweet.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // Update tweet
    // Update tweet
    builder.addCase(updateTweet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTweet.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;

      // If backend returned an updated tweet, replace it in state
      if (action.payload && action.payload._id) {
        state.data = state.data.map((tweet) =>
          tweet._id === action.payload._id ? action.payload : tweet
        );
      }
      // Otherwise, leave state.data as is (we re-fetch in component)
    });
    builder.addCase(updateTweet.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // delete tweet
    builder.addCase(deleteTweet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTweet.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter((t) => t._id !== action.payload.tweetId);
      state.status = true;
    });

    builder.addCase(deleteTweet.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
    // get all tweets
    builder.addCase(getAllTweets.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllTweets.fulfilled, (state, action) => {
      state.loading = false;
      state.data = Array.isArray(action.payload) ? action.payload : [];
      state.status = true;
    });
    builder.addCase(getAllTweets.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export default tweetSlice.reducer;

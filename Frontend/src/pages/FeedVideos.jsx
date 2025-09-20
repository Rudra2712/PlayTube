import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../app/Slices/videoSlice";

import {
  VideoGrid,
  VideoList,
  EmptyVideo,
  Logo,
  Dashboard,
  Home,
  AuthLayout,
  Login,
  SignUp,
  Feed,
  ChangePassword,
  DeleteVideo,
  EditVideo,
  EditChannelInfo,
  MyChannelTweets,
  EditPersonalInfo,
  MyChannelEmptyTweet,
  UploadingVideo,
  UploadSuccess,
  UploadVideo,
  MyChannelEmptyVideo,
  EmptySubscription,
  ChannelSubscribed,
  ChannelTweets,
  EmptyTweet,
  PlaylistVideos,
  ChannelPlaylist,
  EmptyPlaylist,
  ChannelVideos,
  EmptyChannelVideo,
  VideoDetail,
} from "../components/index";
function FeedVideos() {
 

  const dispatch = useDispatch();
  const { videos, loading ,error } = useSelector((state) => state.video); // 👈 use Redux state

  useEffect(() => {
    dispatch(getAllVideos());
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return <VideoGrid videos={videos || []} />;
}

export default FeedVideos;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import EmptySubscription from "./EmptySubscription";
import {
  getSubscribedChannels,
  toggleSubscription,
} from "../../app/Slices/subscriptionSlice";
import { channelProfile } from "../../app/Slices/userSlice";
import { useState } from "react";
function ChannelSubscribed() {
  const { username } = useParams();
  const { userData: channelData } = useSelector((state) => state.user);
  const { userData: authUser } = useSelector((state) => state.auth);
  const { data: subscribedChannels, loading } = useSelector(
    (state) => state.subscription
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (username) {
      dispatch(channelProfile(username));
    }
  }, [username, dispatch]);

  useEffect(() => {
    if (channelData?._id) {
      dispatch(getSubscribedChannels(channelData._id));
    }
  }, [channelData?._id, dispatch]);

  const handleToggleSubscription = (channelId) => {
    if (!authUser) return;
    dispatch(toggleSubscription(channelId)).then(() => {
      if (channelData?._id) {
        dispatch(getSubscribedChannels(channelData._id));
      }
    });
  };

  if (loading) {
    return <div className="py-8 text-center text-gray-400">Loading...</div>;
  }

  if (!subscribedChannels || subscribedChannels.length === 0) {
    return <EmptySubscription />;
  }

  return (
    <div className="flex flex-col gap-y-4 py-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-600 ">
        Subscribed Channels
      </h2>

      {subscribedChannels.map((sub) => (
        <div
          key={sub.channel._id}
          className="flex w-full justify-between items-center"
        >
          <div className="flex items-center gap-x-2">
            <Link to={`/user/${sub.channel.username}/videos`}>
              <div className="h-14 w-14 shrink-0">
                <img
                  src={sub.channel.avatar}
                  alt={sub.channel.username}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </Link>
            <div className="block">
              <h6 className="font-semibold">{sub.channel.username}</h6>
              <p className="text-sm text-gray-300">
                {sub.channel.subscribersCount ?? 0} Subscribers
              </p>
            </div>
          </div>

          {authUser && authUser._id !== sub.channel._id && (
            <button
              onClick={() => handleToggleSubscription(sub.channel._id)}
              className={`group/btn px-3 py-2 rounded-lg transition ${
                sub.isSubscribed
                  ? "text-black bg-[#ae7aff] hover:bg-white"
                  : "text-black bg-white hover:bg-[#ae7aff] hover:text-white"
              }`}
            >
              {sub.isSubscribed ? (
                <>
                  <span className="group-hover/btn:hidden">Subscribed</span>
                  <span className="hidden group-hover/btn:inline">
                    Unsubscribe
                  </span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChannelSubscribed;

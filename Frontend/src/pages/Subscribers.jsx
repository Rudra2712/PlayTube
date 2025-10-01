import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubscribedChannels,
  toggleSubscription,
} from "../app/Slices/subscriptionSlice";
import { Link } from "react-router-dom";

function Subscribers() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth); // logged-in user
  const { data: channels, loading } = useSelector(
    (state) => state.subscription
  );

  useEffect(() => {
    if (userData?._id) {
      dispatch(getSubscribedChannels(userData._id));
    }
  }, [dispatch, userData]);

  const handleToggleSubscription = (channelId) => {
    // Optimistic UI: remove from state immediately
    const newList = channels.filter((sub) => sub.channel._id !== channelId);

    dispatch({
      type: "subscription/getSubscribedChannels/fulfilled",
      payload: newList,
    });

    // Then actually make the API call
    dispatch(toggleSubscription(channelId)).then(() => {
      dispatch(getSubscribedChannels(userData._id));
    });
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading subscriptions...</p>
    );
  }
  if (!channels || channels.length === 0) {
    // console.log(channels);
    return (
      <p className="text-center text-gray-400">
        You haven’t subscribed to any channels yet.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Subscribed Channels
      </h2>

      <div className="space-y-4">
        {channels.map((sub) => (
          <div
            key={sub.channel._id}
            className="flex w-full justify-between items-center border-b pb-3"
          >
            {/* Channel Info */}
            <div className="flex items-center gap-x-3">
              <Link to={`/user/${sub.channel.username}/videos`}>
                <div className="h-14 w-14 shrink-0">
                  <img
                    src={
                      sub.channel.avatar ||
                      "https://via.placeholder.com/150x150.png?text=No+Avatar"
                    }
                    alt={sub.channel.username}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              </Link>
              <div>
                <h6 className="font-semibold">{sub.channel.username}</h6>
                <p className="text-sm text-gray-400">
                  {sub.channel.subscribersCount || 0} Subscribers
                </p>
              </div>
            </div>

            {/* Subscribe / Subscribed Button */}
            <div>
              <button
                onClick={() => handleToggleSubscription(sub.channel._id)}
                className="group/btn px-3 py-2 rounded-md text-black bg-white border hover:bg-[#ae7aff] hover:text-white transition"
              >
                <span className="group-hover/btn:hidden">Subscribed</span>
                <span className="hidden group-hover/btn:inline">
                  Unsubscribe
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscribers;

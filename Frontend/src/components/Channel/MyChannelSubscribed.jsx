import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyChannelEmptySubscribed from "./MyChannelEmptySubscribed";
import { getSubscribedChannels } from "../../app/Slices/subscriptionSlice";
import { Link } from "react-router-dom";
import { toggleSubscription } from "../../app/Slices/subscriptionSlice";
function MyChannelSubscribed() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.userData);
  const { data: subscribedChannels, loading } = useSelector(
    (state) => state.subscription
  );
  useEffect(() => {
    if (authUser?._id) {
      dispatch(getSubscribedChannels(authUser._id)); // ✅ call the correct thunk
    }
  }, [authUser?._id, dispatch]);

  if (loading) {
    return <div className="py-8 text-center text-gray-400">Loading...</div>;
  }

  if (!subscribedChannels || subscribedChannels.length === 0) {
    return <MyChannelEmptySubscribed />;
  }
  const handleToggleSubscription = (channelId) => {
    dispatch(toggleSubscription(channelId)).then(() => {
      // Refresh the subscribed channels list after toggling
      dispatch(getSubscribedChannels(authUser._id));
    });
  };

  return (
    <div className="flex flex-col gap-y-4 py-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-600">
        Subscribed Channels
      </h2>
      {subscribedChannels.map((sub) => (
        <div key={sub._id} className="flex justify-between items-center">
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
            <div>
              <h6 className="font-semibold">{sub.channel.username}</h6>
              <p className="text-sm text-gray-300">
                {sub.channel.subscribersCount ?? 0} Subscribers
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggleSubscription(sub.channel._id)}
            className="group/btn px-3 py-2 text-black bg-[#ae7aff] hover:bg-white hover:text-[#ae7aff] rounded-lg transition"
          >
            <span className="group-hover/btn:hidden">Subscribed</span>
            <span className="hidden group-hover/btn:inline">Unsubscribe</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyChannelSubscribed;

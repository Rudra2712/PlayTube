import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleSubscription } from "../app/Slices/subscriptionSlice";
const Channel = () => {
  const { username } = useParams();
  const [channelUser, setChannelUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (channelUser) {
      setIsSubscribed(channelUser.isSubscribed);
    }
  }, [channelUser]);
  const handleToggleSubscription = () => {
    if (!channelUser?._id) return;
    dispatch(toggleSubscription(channelUser._id));
    setIsSubscribed((prev) => !prev); // optimistic update
  };

  useEffect(() => {
    const fetchChannelUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/users/c/${username}`
        );
        // console.log("Fetched channel user data:", res.data.data);
        setChannelUser(res.data.data); // adjust based on your API response shape
      } catch (err) {
        console.error("Error fetching channel:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchChannelUser();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-400">
        Loading channel...
      </div>
    );
  }

  if (!channelUser) {
    return (
      <div className="flex justify-center items-center py-12 text-red-400">
        Channel not found.
      </div>
    );
  }

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {/* Cover Image */}
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={channelUser.coverImage || "https://placehold.co/1200x300"}
            alt="cover-photo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Channel Metadata */}
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
            <img
              src={channelUser.avatar || "https://placehold.co/150x150"}
              alt={channelUser.username || "Channel"}
              className="h-full w-full object-cover"
            />
          </span>

          <div className="mr-auto inline-block">
            <h1 className="font-bold text-xl">
              {/* {console.log(channelUser)} */}
              {channelUser.fullName || "Unknown User"}
            </h1>
            <p className="text-sm text-gray-400">@{channelUser.username}</p>
            <p className="text-sm text-gray-400">
              {channelUser.subscribersCount || 0} Subscribers ·{" "}
              {channelUser.channelsSubscribedToCount || 0} Subscribed
            </p>
          </div>

          {/* Subscribe Button */}
          <div className="inline-block">
            <div className="inline-flex min-w-[145px] justify-end">
              <button
                onClick={handleToggleSubscription}
                className={`group/btn mr-1 flex w-full items-center gap-x-2 px-3 py-2 text-center font-bold text-black 
    ${isSubscribed ? "bg-gray-400" : "bg-[#ae7aff]"}
    shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out 
    active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto`}
              >
                <span className="inline-block w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                    />
                  </svg>
                </span>
                <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="no-scrollbar sticky top-[66px] z-[2] flex gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
        <li>
          <NavLink
            to="videos"
            className={({ isActive }) =>
              `px-3 py-1.5 border-b-2 ${
                isActive
                  ? "border-[#ae7aff] text-[#ae7aff] font-semibold"
                  : "border-transparent text-gray-400"
              }`
            }
          >
            Videos
          </NavLink>
        </li>
        <li>
          <NavLink
            to="playlists"
            className={({ isActive }) =>
              `px-3 py-1.5 border-b-2 ${
                isActive
                  ? "border-[#ae7aff] text-[#ae7aff] font-semibold"
                  : "border-transparent text-gray-400"
              }`
            }
          >
            Playlists
          </NavLink>
        </li>
        <li>
          <NavLink
            to="tweets"
            className={({ isActive }) =>
              `px-3 py-1.5 border-b-2 ${
                isActive
                  ? "border-[#ae7aff] text-[#ae7aff] font-semibold"
                  : "border-transparent text-gray-400"
              }`
            }
          >
            Tweets
          </NavLink>
        </li>
        <li>
          <NavLink
            to="subscribed"
            className={({ isActive }) =>
              `px-3 py-1.5 border-b-2 ${
                isActive
                  ? "border-[#ae7aff] text-[#ae7aff] font-semibold"
                  : "border-transparent text-gray-400"
              }`
            }
          >
            Subscribed
          </NavLink>
        </li>
      </ul>

      {/* Nested Routes */}
      <Outlet />
    </section>
  );
};

export default Channel;

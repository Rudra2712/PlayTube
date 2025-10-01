import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { channelProfile } from "../app/Slices/userSlice";
import { useDispatch } from "react-redux";

const MyChannel = () => {
  const authUser = useSelector((state) => state.auth.userData);
  const channelData = useSelector((state) => state.user.userData);

  // Use channelData if available (has counts), otherwise fall back to authUser
  const user = channelData || authUser;

  // console.log("Auth user from Redux:", authUser || null);
  // console.log("Channel data from Redux:", channelData || null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser?.username) {
      dispatch(channelProfile(authUser.username));
    }
  }, [authUser?.username, dispatch]);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {/* Cover Image */}
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={user?.coverImage || "https://placehold.co/1200x300"}
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
              src={user?.avatar || "https://placehold.co/150x150"}
              alt={user?.username || "Channel"}
              className="h-full w-full object-cover"
            />
          </span>

          <div className="mr-auto inline-block">
            <h1 className="font-bold text-xl">
              {user?.fullName || "Guest User"}
            </h1>
            <p className="text-sm text-gray-400">
              @{user?.username || "guest"}
            </p>
            <p className="text-sm text-gray-400">
              {user?.subscribersCount || 0} Subscribers ·{" "}
              {user?.channelsSubscribedToCount || 0} Subscribed
            </p>
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

      {/* Render nested routes */}
      <Outlet />
    </section>
  );
};

export default MyChannel;

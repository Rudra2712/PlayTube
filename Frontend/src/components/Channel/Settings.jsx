import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { channelProfile } from "../../app/Slices/userSlice";
import { axiosInstance } from "../../helpers/axios.helper";
import { toast } from "react-toastify";

function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState({ avatar: false, cover: false });

  const authUser = useSelector((state) => state.auth.userData);
  const channelData = useSelector((state) => state.user.userData);

  // Use channelData (fetched) if available, otherwise fallback to authUser
  const user = channelData || authUser;

  useEffect(() => {
    if (authUser?.username) {
      dispatch(channelProfile(authUser.username));
    }
  }, [authUser?.username, dispatch]);

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append(type === "avatar" ? "avatar" : "coverImage", file);

    setUploading({ ...uploading, [type]: true });

    try {
      const url = type === "avatar" ? "/users/avatar" : "/users/cover-image";

      const { data } = await axiosInstance.patch(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        type === "avatar" 
          ? "Avatar updated successfully" 
          : "Cover image updated successfully"
      );

      // Re-fetch channel profile after update to refresh UI
      if (authUser?.username) {
        await dispatch(channelProfile(authUser.username));
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(
        error.response?.data?.message || 
        `Failed to update ${type === "avatar" ? "avatar" : "cover image"}`
      );
    } finally {
      setUploading({ ...uploading, [type]: false });
      // Reset file input
      e.target.value = "";
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ae7aff] border-r-transparent"></div>
          <p className="text-gray-300">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {/* Cover Image */}
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={user.coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200"}
            alt="cover-photo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <input
            type="file"
            id="cover-image"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleImageChange(e, "cover")}
            disabled={uploading.cover}
          />
          <label
            htmlFor="cover-image"
            className={`inline-block h-10 w-10 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white ${
              uploading.cover ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Upload cover image"
          >
            {uploading.cover ? (
              <div className="h-full w-full animate-spin rounded-full border-2 border-solid border-[#ae7aff] border-r-transparent"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            )}
          </label>
        </div>
      </div>

      {/* Avatar & Basic Info */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <div className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=ae7aff&color=000`}
              alt="Channel"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <input
                type="file"
                id="profile-image"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleImageChange(e, "avatar")}
                disabled={uploading.avatar}
              />
              <label
                htmlFor="profile-image"
                className={`inline-block h-8 w-8 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white ${
                  uploading.avatar ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Upload avatar"
              >
                {uploading.avatar ? (
                  <div className="h-full w-full animate-spin rounded-full border-2 border-solid border-[#ae7aff] border-r-transparent"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                )}
              </label>
            </div>
          </div>
          <div className="mr-auto inline-block">
            <h1 className="font-bold text-xl">{user.fullName}</h1>
            <p className="text-sm text-gray-400">@{user.username}</p>
            {user.subscribersCount !== undefined && (
              <p className="text-sm text-gray-400 mt-1">
                {user.subscribersCount} subscriber{user.subscribersCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="inline-block">
            <button
              onClick={() => navigate(`/channel/videos`)}
              className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
            >
              View channel
            </button>
          </div>
        </div>

        {/* Tabs */}
        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
          <li className="w-full">
            <NavLink end to="">
              {({ isActive }) => (
                <button
                  className={`w-full px-3 py-1.5 ${
                    isActive
                      ? "border-b-2 border-[#ae7aff] bg-white text-[#ae7aff]"
                      : "text-gray-400"
                  }`}
                >
                  Personal Information
                </button>
              )}
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink to="channelinfo">
              {({ isActive }) => (
                <button
                  className={`w-full px-3 py-1.5 ${
                    isActive
                      ? "border-b-2 border-[#ae7aff] bg-white text-[#ae7aff]"
                      : "text-gray-400"
                  }`}
                >
                  Channel Information
                </button>
              )}
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink to="changepwd">
              {({ isActive }) => (
                <button
                  className={`w-full px-3 py-1.5 ${
                    isActive
                      ? "border-b-2 border-[#ae7aff] bg-white text-[#ae7aff]"
                      : "text-gray-400"
                  }`}
                >
                  Change Password
                </button>
              )}
            </NavLink>
          </li>
        </ul>

        {/* Render sub-pages */}
        <Outlet context={{ user }} />
      </div>
    </section>
  );
}

export default Settings;
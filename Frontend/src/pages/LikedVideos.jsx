// pages/LikedVideos.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikedVideos } from "../app/Slices/likeSlice.js";
import LikedVideoCard from "../components/Video/LikedVideoCard";

const LikedVideos = () => {
  const dispatch = useDispatch();
  const { data: likedVideos, loading } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(getLikedVideos());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="p-4 sm:ml-[70px] lg:ml-0">
        <h2 className="text-2xl font-bold mb-6 text-white">Liked Videos</h2>
        <p className="text-gray-400">Loading liked videos...</p>
      </section>
    );
  }

  if (!likedVideos || likedVideos.length === 0) {
    return (
      <section className="p-4 sm:ml-[70px] lg:ml-0">
        <h2 className="text-2xl font-bold mb-6 text-white">Liked Videos</h2>
        <p className="text-gray-400">No liked videos found</p>
      </section>
    );
  }

  return (
    <section className="p-4 sm:ml-[70px] lg:ml-0">
      <h2 className="text-2xl font-bold mb-6 text-white">Liked Videos</h2>
      <div className="flex flex-col gap-6">
        {likedVideos.map((video) => (
          <div key={video._id} className="w-full">
            <LikedVideoCard video={video} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LikedVideos;

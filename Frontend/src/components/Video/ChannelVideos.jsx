import React, { useEffect } from "react";
import EmptyChannelVideo from "./EmptyChannelVideo";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../../app/Slices/videoSlice";
import { Link, useParams } from "react-router-dom";

function ChannelVideos() {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.video);
  const loggedInUser = useSelector((state) => state.auth?.userData);
  const { username } = useParams(); // <-- grab username from URL

  useEffect(() => {
    if (username) {
      // viewing another user's channel
      dispatch(getAllVideos({ username }))
        .unwrap()
        .then((res) => console.log("Fetched videos response:", res))
        .catch((err) => console.error("Error fetching videos:", err));
    } else if (loggedInUser?._id) {
      // viewing my own channel
      dispatch(getAllVideos({ userId: loggedInUser._id }))
        .unwrap()
        .then((res) => console.log("Fetched videos response:", res))
        .catch((err) => console.error("Error fetching videos:", err));
    }
  }, [username, loggedInUser?._id, dispatch]);

  if (loading) {
    return <p className="text-gray-400">Loading videos...</p>;
  }

  return (
    <>
      {!videos || !videos.length ? (
        <EmptyChannelVideo />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
          {videos.map((video) => (
            <div className="w-full" key={video._id}>
              <Link to={`/video/${video._id}`}>
                <div className="relative mb-2 w-full pt-[56%]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover rounded"
                  />
                  <span className="absolute bottom-1 right-1 bg-black px-1.5 text-sm rounded">
                    {Math.floor(video.duration / 60)}:{("0" + Math.floor(video.duration % 60)).slice(-2)}
                  </span>
                </div>
                <h6 className="mb-1 font-semibold">{video.title}</h6>
                <p className="text-sm text-gray-400">
                  {video.views} views ·{" "}
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default ChannelVideos;

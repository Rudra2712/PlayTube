import React, { useEffect } from "react";
import MyChannelEmptyVideo from "./MyChannelEmptyVideo";
import UploadVideo from "./UploadVideo";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../../app/Slices/videoSlice";
import { Link } from "react-router-dom";

function MyChannelVideos() {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.video);
  const loggedInUser = useSelector((state) => state.auth?.userData);

  const channelId = loggedInUser?._id || loggedInUser?.id;

  useEffect(() => {
    if (channelId) {
      dispatch(getAllVideos({ userId: channelId }))
        .unwrap()
        .then((res) => console.log("Fetched videos response:", res))
        .catch((err) => console.error("Error fetching videos:", err));
    }
  }, [loggedInUser, channelId, dispatch]);

  // console.log("Redux video state - videos:", videos);
  // console.log("Channel ID:", channelId);

  if (!channelId) {
    return <p className="text-gray-400">Loading user info...</p>;
  }

  if (loading) {
    return <p className="text-gray-400">Loading videos...</p>;
  }

  return (
    <>
      {/* <div className="mb-6">
        <UploadVideo />
      </div> */}

      {!videos || !videos.length ? (
        <MyChannelEmptyVideo />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-600">
            Videos
          </h2>
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
                    {(video.duration / 100).toFixed(2).replace(".", ":")}
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
      </>
      )}
    </>
  );
}

export default MyChannelVideos;

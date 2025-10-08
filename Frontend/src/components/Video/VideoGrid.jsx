import React from "react";
import { Link } from "react-router-dom";

function VideoGrid({ videos }) {
  // Filter only published videos for homepage
  const publishedVideos = videos.filter(video => video.isPublished !== false);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
        {publishedVideos.map((video) => (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className="w-full block"
          >
            <div className="relative mb-2 w-full pt-[56%]">
              <div className="absolute inset-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover rounded"
                />
              </div>
              <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                {Math.floor(video.duration / 60)}:
                {("0" + Math.floor(video.duration % 60)).slice(-2)}
              </span>
            </div>
            <div className="flex gap-x-2">
              <div className="h-10 w-10 shrink-0">
                <Link to={`/user/${video.owner?.username}/videos`}>
                  <img
                    src={video.owner.avatar}
                    alt="user avatar"
                    className="h-full w-full rounded-full"
                  />
                </Link>
              </div>
              <div className="w-full">
                <h6 className="mb-1 font-semibold">{video.title}</h6>
                <p className="flex text-sm text-gray-200">
                  {video.views} Views ·{" "}
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-200">{video.owner?.username}</p>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Show message if no published videos */}
        {publishedVideos.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400">
            No published videos available
          </div>
        )}
      </div>
    </section>
  );
}

export default VideoGrid;
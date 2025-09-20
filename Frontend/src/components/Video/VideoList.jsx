import React from "react";
import { Link } from "react-router-dom";

const VideoList = ({ video }) => {
  if (!video) return null;

  return (
    <div className="w-full max-w-3xl gap-x-4 md:flex">
      {/* Thumbnail */}
      <Link
        to={`/video/${video._id}`}
        className="relative mb-2 w-full md:mb-0 md:w-5/12"
      >
        <div className="w-full pt-[56%]">
          <div className="absolute inset-0">
            <img
              src={video.thumbnail || "https://placehold.co/600x400"}
              alt={video.title}
              className="h-full w-full object-cover rounded"
            />
          </div>
          <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
            {Math.floor(video.duration / 60)}:
            {("0" + Math.floor(video.duration % 60)).slice(-2) || "00:00"}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex gap-x-2 md:w-7/12">
        <div className="h-10 w-10 shrink-0 md:hidden">
          <img
            src={video.owner?.avatar || "/default-avatar.png"}
            alt={video.owner?.username}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h6 className="mb-1 font-semibold md:max-w-[75%] line-clamp-2">
            <Link to={`/video/${video._id}`}>{video.title}</Link>
          </h6>
          <p className="flex text-sm text-gray-200 sm:mt-3">
            {(video.duration / 100).toFixed(2).replace(".", ":")} Views ·{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-x-4">
            <div className="mt-2 hidden h-10 w-10 shrink-0 md:block">
              <img
                src={video.owner?.avatar || "/default-avatar.png"}
                alt={video.owner?.username}
                className="h-full w-full rounded-full"
              />
            </div>
            <p className="text-sm text-gray-200">{video.owner?.username}</p>
          </div>
          <p className="mt-2 hidden text-sm md:block line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoList;

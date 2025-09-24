// components/Video/LikedVideoCard.jsx
import { Link } from "react-router-dom";

const LikedVideoCard = ({ video }) => {
  return (
    <div className="w-full flex gap-x-4 rounded-xl bg-[#1a1a1a] p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="relative w-5/12 min-w-[200px]">
        <div className="w-full pt-[56%]">
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <Link to={`/video/${video._id}`}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover rounded-lg transform hover:scale-[1.02] transition-transform duration-300 ease-in-out"
              />
            </Link>
          </div>
          {video.duration && (
            <span className="absolute bottom-1 right-1 inline-block rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {Math.floor(video.duration / 60)}:
            {("0" + Math.floor(video.duration % 60)).slice(-2) || "00:00"}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 gap-x-3">
        {/* Avatar (mobile) */}
        <div className="h-10 w-10 shrink-0 md:hidden">
          <img
            src={video.owner?.avatar || "/default-avatar.png"}
            alt={video.owner?.username || "user"}
            className="h-full w-full rounded-full"
          />
        </div>

        <div className="w-full">
          <h6 className="mb-1 font-semibold text-white leading-tight hover:text-blue-400 transition-colors duration-200">
            <Link to={`/video/${video._id}`}>{video.title}</Link>
          </h6>
          <p className="flex text-sm text-gray-400">
            {video.views.toLocaleString()} views ·{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </p>

          <div className="flex items-center gap-x-3 mt-2">
            {/* Avatar (desktop) */}
            <div className="hidden h-10 w-10 shrink-0 md:block">
              <Link to={`/user/${video.owner?.username}/videos`}>
                <img
                  src={video.owner?.avatar || "/default-avatar.png"}
                  alt={video.owner?.username}
                  className="h-full w-full rounded-full hover:opacity-90 transition duration-200"
                />
              </Link>
            </div>
            <p className="text-sm font-medium text-gray-200 hover:text-white transition-colors duration-200">
              {video.owner?.fullName || video.owner?.username}
            </p>
          </div>

          <p className="mt-2 hidden text-sm text-gray-400 md:block line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LikedVideoCard;

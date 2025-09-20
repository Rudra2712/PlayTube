import React, { useState, useEffect } from "react";

function EditVideo({ isOpen, onClose, video, onUpdate }) {
  const [title, setTitle] = useState(video?.title || "");
  const [description, setDescription] = useState(video?.description || "");
  const [thumbnail, setThumbnail] = useState(null); // new file

  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setThumbnail(null);
    }
  }, [video]);

  if (!isOpen) return null; // don’t render if closed

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      title: title !== video.title ? title : undefined,
      description: description !== video.description ? description : undefined,
      thumbnail: thumbnail || undefined,
    };

    if (onUpdate) onUpdate(video._id, updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg border border-gray-700 bg-[#121212] p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Video</h2>
          <button
            onClick={onClose}
            className="h-6 w-6 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className="mb-1 block text-sm">
              Thumbnail
            </label>
            <label
              className="relative block cursor-pointer border border-dashed p-2 text-sm text-gray-300 hover:bg-black/10"
              htmlFor="thumbnail"
            >
              <input
                type="file"
                className="sr-only"
                id="thumbnail"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  // console.log("Selected file:", file);
                  setThumbnail(file);
                }}
              />
              {thumbnail ? (
                <p>{thumbnail.name}</p>
              ) : (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="rounded"
                />
              )}
            </label>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-1 block text-sm">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-gray-600 bg-transparent px-2 py-1 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="desc" className="mb-1 block text-sm">
              Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32 w-full resize-none rounded border border-gray-600 bg-transparent px-2 py-1 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#ae7aff] px-4 py-2 rounded text-black font-semibold hover:bg-[#9a66e5]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideo;

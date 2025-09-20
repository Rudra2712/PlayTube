import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { publishVideo } from "../../app/Slices/videoSlice";

const UploadVideo = ({onSuccess}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.video);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(publishVideo({ data }))
      .unwrap()
      .then(() => {
        reset();
        if (onSuccess) onSuccess();
      })
      .catch((err) => console.error("Upload error:", err));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-white">
      {/* Title */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:border-[#ae7aff] focus:outline-none"
          placeholder="Enter video title"
        />
        {errors.title && (
          <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Description</label>
        <textarea
          rows="3"
          {...register("description", {
            required: "Description is required",
          })}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:border-[#ae7aff] focus:outline-none"
          placeholder="Write a short description"
        />
        {errors.description && (
          <p className="text-sm text-red-400 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Video File */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Video File</label>
        <input
          type="file"
          accept="video/*"
          {...register("videoFile", { required: "Video file is required" })}
          className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-[#ae7aff] file:px-3 file:py-1.5 file:text-black hover:file:bg-[#9a66e5] cursor-pointer"
        />
        {errors.videoFile && (
          <p className="text-sm text-red-400 mt-1">
            {errors.videoFile.message}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          {...register("thumbnail", { required: "Thumbnail is required" })}
          className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-[#ae7aff] file:px-3 file:py-1.5 file:text-black hover:file:bg-[#9a66e5] cursor-pointer"
        />
        {errors.thumbnail && (
          <p className="text-sm text-red-400 mt-1">
            {errors.thumbnail.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[#ae7aff] px-4 py-2 text-sm font-semibold text-black shadow hover:bg-[#9a66e5] disabled:opacity-50 transition"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadVideo;

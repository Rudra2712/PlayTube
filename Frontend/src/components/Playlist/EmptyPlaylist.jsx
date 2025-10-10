import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createPlaylist,
  getUserPlaylists,
} from "../../app/Slices/playlistSlice";
import { toast } from "react-toastify";

function EmptyPlaylist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { channelId } = useParams(); // assuming route like /channel/:channelId/playlists
  const { userData } = useSelector((state) => state.user);

  const isOwner = userData?._id === channelId; // check if current user owns the channel

  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      alert("Playlist title is required");
      return;
    }

    // Dispatch create action
    dispatch(
      createPlaylist({
        name: playlistName.trim(),
        description: playlistDesc.trim(),
      })
    );

    // Refresh playlists
    dispatch(getUserPlaylists(userData._id));

    // Close modal and reset
    setShowModal(false);
    setPlaylistName("");
    setPlaylistDesc("");
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <p className="mb-3 w-full">
          <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            <span className="inline-block w-6">
              <svg
                style={{ width: "100%" }}
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </span>
        </p>

        <h5 className="mb-2 font-semibold text-lg text-white">
          No playlist created
        </h5>
        <p className="text-gray-400 mb-4">
          There are no playlists created on this channel.
        </p>

        {isOwner && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 rounded-lg bg-[#AE7AFF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9b5fff]"
          >
            Create a Playlist
          </button>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-[#1E1E1E] rounded-xl p-6 w-[90%] max-w-md shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Create New Playlist
              </h2>
              <input
                type="text"
                placeholder="Playlist Title"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full mb-3 p-2 rounded-md bg-[#2C2C2C] text-white outline-none"
              />
              <textarea
                placeholder="Description (optional)"
                value={playlistDesc}
                onChange={(e) => setPlaylistDesc(e.target.value)}
                className="w-full mb-4 p-2 rounded-md bg-[#2C2C2C] text-white outline-none resize-none"
                rows="3"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  className="px-4 py-2 rounded-lg bg-[#AE7AFF] text-white font-semibold hover:bg-[#9b5fff]"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyPlaylist;

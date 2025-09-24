import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // const handleSignUp = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage("");
  //   try {
  //     // Adjust endpoint and payload to your backend!
  //     const res = await axios.post(
  //       "http://localhost:8000/api/v1/users/register",
  //       { email, username, fullName, password, avatar, cover }
  //     );
  //     setMessage(
  //       "Sign up successful! Please check your email to verify your account."
  //     );

  //   } catch (error) {
  //     setMessage(error?.response?.data?.message || "Sign up failed.");
  //   }
  //   setLoading(false);
  // };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Create FormData so we can send files & text data together
      const form = new FormData();
      // console.log(
      //   "Works till here after this line console logs are not printing"
      // ); // Debugging line to check avatar file
      form.append("fullName", fullName); // must match backend expected field name
      form.append("username", username);
      form.append("email", email);
      form.append("password", password);

      if (avatar) form.append("avatar", avatar); // File input from state
      if (cover) form.append("coverImage", cover); // Optional

      const res = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setMessage(
        "Sign up successful! Please check your email to verify your account."
      );
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(error?.response?.data?.message || "Sign up failed.");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#121212] text-white">
      <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4">
        <div className="mx-auto inline-block w-16">
          <Link to={"/"}>
            <svg
              style={{ width: "100%" }}
              viewBox="0 0 63 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M47.25 47.458C55.9485 38.7595 55.9485 24.6565 47.25 15.958C38.5515 7.25952 24.4485 7.25952 15.75 15.958C7.05151 24.6565 7.05151 38.7595 15.75 47.458C24.4485 56.1565 38.5515 56.1565 47.25 47.458Z"
                stroke="#E9FCFF"
                strokeWidth="1.38962"
                strokeMiterlimit="10"
              ></path>
              <path
                d="M10.5366 47.7971V17.5057C10.5366 16.9599 11.1511 16.6391 11.599 16.9495L33.4166 32.0952C33.8041 32.3639 33.8041 32.9368 33.4166 33.2076L11.599 48.3533C11.1511 48.6657 10.5366 48.3429 10.5366 47.7971Z"
                stroke="url(#paint0_linear_53_10115)"
                strokeWidth="6.99574"
                strokeMiterlimit="10"
                strokeLinecap="round"
              ></path>
              <path
                d="M18.1915 27.6963C20.1641 27.6963 21.7285 28.7066 21.7285 30.9021C21.7285 33.0976 20.1621 34.2433 18.1915 34.2433H16.8854V37.8677H14.1733V27.6984H18.1915V27.6963Z"
                fill="#E9FCFF"
              ></path>
              <path
                d="M25.2053 27.6963V35.4868H28.484V37.8657H22.4932V27.6963H25.2053Z"
                fill="#E9FCFF"
              ></path>
              <path
                d="M35.3142 27.6963L39.4553 37.8657H36.5328L35.9162 36.1763H32.1939L31.5773 37.8657H28.6548L32.7959 27.6963H35.3101H35.3142ZM34.9143 33.5663L34.2144 31.7832C34.1582 31.6395 33.954 31.6395 33.8978 31.7832L33.1979 33.5663C33.1541 33.6767 33.2354 33.7975 33.3562 33.7975H34.756C34.8747 33.7975 34.958 33.6767 34.9143 33.5663Z"
                fill="#E9FCFF"
              ></path>
              <path
                d="M40.9491 27.6963L42.8592 30.5188L44.7694 27.6963H48.0355L44.2132 33.2559V37.8657H41.5011V33.2559L37.6787 27.6963H40.9449H40.9491Z"
                fill="#E9FCFF"
              ></path>
              <path
                d="M16.894 32.1396V29.9129C16.894 29.8212 16.9982 29.7671 17.0732 29.8191L18.6771 30.9315C18.7417 30.9773 18.7417 31.0731 18.6771 31.1189L17.0732 32.2313C16.9982 32.2834 16.894 32.2313 16.894 32.1375V32.1396Z"
                fill="#232323"
              ></path>
              <defs>
                <linearGradient
                  id="paint0_linear_53_10115"
                  x1="2.23416"
                  y1="20.3361"
                  x2="26.863"
                  y2="44.9649"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#007EF8"></stop>
                  <stop offset="1" stop-color="#FF4A9A"></stop>
                </linearGradient>
              </defs>
            </svg>
          </Link>
        </div>
        <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
          Play
        </div>
        <form
          onSubmit={handleSignUp}
          className="max-w-md mx-auto bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Sign Up
          </h2>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-gray-300 font-medium"
            >
              Username<span className="text-red-400">*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 
                  focus:outline-none focus:ring-2 focus:ring-[#ae7aff] focus:border-transparent"
            />
          </div>

          {/* Fullname */}
          <div>
            <label
              htmlFor="fullname"
              className="mb-1 block text-gray-300 font-medium"
            >
              Full name<span className="text-red-400">*</span>
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 
                  focus:outline-none focus:ring-2 focus:ring-[#ae7aff] focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-gray-300 font-medium"
            >
              Email<span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 
                  focus:outline-none focus:ring-2 focus:ring-[#ae7aff] focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-gray-300 font-medium"
            >
              Password<span className="text-red-400">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 
                  focus:outline-none focus:ring-2 focus:ring-[#ae7aff] focus:border-transparent"
            />
          </div>

          {/* Avatar Image */}
          <div>
            <label
              htmlFor="avatar"
              className="mb-1 block text-gray-300 font-medium"
            >
              Avatar Image
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white
                  file:bg-[#ae7aff] file:text-black file:rounded-lg file:px-3 file:py-1 file:mr-2"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label
              htmlFor="cover"
              className="mb-1 block text-gray-300 font-medium"
            >
              Cover Image
            </label>
            <input
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => setCover(e.target.files[0])}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white
                  file:bg-purple-500 file:text-black file:rounded-lg file:px-3 file:py-1 file:mr-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#ae7aff] to-purple-500 px-4 py-3
               text-black font-medium transition-all duration-200 hover:scale-[1.02]
               hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* Error / Message */}
          {message && (
            <div className="mt-4 text-center text-sm text-red-400">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUp;

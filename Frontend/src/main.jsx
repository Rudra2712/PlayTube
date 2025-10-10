import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import {
  ChannelPlaylist,
  ChannelSubscribed,
  ChannelTweets,
  ChannelVideos,
  Dashboard,
  Feed,
  Home,
  Login,
  MyChannelTweets,
  MyChannelVideos,
  SignUp,
  VideoDetail,
  MyChannelSubscribed,
  MyChannelPlaylists,
  EditPersonalInfo,
  Settings,
  EditChannelInfo,
  ChangePassword,
  UploadingVideo,
  UploadVideo,
  PlaylistVideos,
  AddVideoToPlaylist,
} from "./components/index.js";
import FeedVideos from "./pages/FeedVideos.jsx";
import Channel from "./pages/Channel.jsx";
import MyChannel from "./pages/MyChannel.jsx";
import History from "./pages/History.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import Subscribers from "./pages/Subscribers.jsx";
import AllTweets from "./pages/AllTweets.jsx";
import Support from "./components/Support.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />}>
        <Route path="support" element={<Support />} />
        <Route path="" element={<Feed />}>
          // Home Page Feed Videos
          <Route path="" element={<FeedVideos />} />
          <Route path="feed/history" element={<History />} />
          <Route path="feed/liked" element={<LikedVideos />} />
          <Route path="feed/subscribers" element={<Subscribers />} />
          // User Feeds // All Other Channels
          <Route path="user/:username" element={<Channel />}>
            <Route path="videos" element={<ChannelVideos />} />
            <Route path="playlists" element={<ChannelPlaylist />} />
            <Route path="tweets" element={<ChannelTweets />} />
            <Route path="subscribed" element={<ChannelSubscribed />} />
          </Route>
          // Owning My Channel
          <Route path="channel" element={<MyChannel />}>
            <Route path="videos" element={<MyChannelVideos />} />
            <Route path="tweets" element={<MyChannelTweets />} />
            <Route path="playlists" element={<MyChannelPlaylists />} />
            <Route path="subscribed" element={<MyChannelSubscribed />} />
          </Route>
          //Settings
          <Route path="settings" element={<Settings />}>
            <Route path="" element={<EditPersonalInfo />} />
            <Route path="channelinfo" element={<EditChannelInfo />} />
            <Route path="changepwd" element={<ChangePassword />} />
          </Route>
          // Playlists
          <Route path="playlist/:playlistId" element={<PlaylistVideos />} />
          <Route
            path="add-video-to-playlist/:playlistId"
            element={<AddVideoToPlaylist />}
          />
          <Route path="search" element={<SearchResults />} />
          <Route path="tweets" element={<AllTweets />} />
        </Route>
        //Video Watching
        <Route path="/video/:videoId" element={<VideoDetail />} />
        // Admin Dashboard
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ErrorBoundary>
);

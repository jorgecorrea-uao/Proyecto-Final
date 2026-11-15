import { Route, Routes } from "react-router-dom";
import Feed from "../pages/Feed/Feed";
import Profile from "../pages/Profile/Profile";
import Explore from "../pages/Explore/Explore";
import Friends from "../pages/Friends/Friends";
import Chat from "../pages/Chat/Chat";
import NotFound from "../pages/NotFound/NotFound";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="feed" element={<Feed />} />
      <Route path="profile/:id" element={<Profile />} />
      <Route path="explore" element={<Explore />} />
      <Route path="friends" element={<Friends />} />
      <Route path="chat" element={<Chat />} />
      <Route path="chat/:friendId" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
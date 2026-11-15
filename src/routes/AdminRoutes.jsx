import { Route, Routes } from "react-router-dom";
import Admin from "../pages/Admin/Admin";
import NotFound from "../pages/NotFound/NotFound";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
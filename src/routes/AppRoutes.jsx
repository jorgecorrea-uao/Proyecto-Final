import { Route, Routes } from "react-router-dom";
import PublicOnlyRoute from "./PublicOnlyRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import Index from "../pages/Index/Index";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminRoutes />
          </AdminRoute>
        }
      />

      <Route
        path="/*"
        element={
          <PrivateRoute>
            <UserRoutes />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
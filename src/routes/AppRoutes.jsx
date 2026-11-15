import { Route, Routes } from "react-router-dom";
import PublicOnlyRoute from "./PublicOnlyRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import Layout from "../components/Shared/Layout";
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
            <Layout>
              <AdminRoutes />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <UserRoutes />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
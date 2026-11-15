import { Link, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function Home() {
  const { user, profile, logout } = useAuth();

  return (
    <main className="container">
      <h1>UAO Connect</h1>
      {user ? (
        <>
          <p>Hola, {profile?.name ?? user.email}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <p>
          <Link to="/login">Iniciar sesión</Link> · <Link to="/register">Registrarse</Link>
        </p>
      )}
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
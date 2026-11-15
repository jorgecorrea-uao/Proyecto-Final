import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Menu.module.scss";

const LINKS = [
  { to: "/feed", label: "Feed" },
  { to: "/explore", label: "Explorar" },
  { to: "/friends", label: "Amigos" },
  { to: "/chat", label: "Chat" },
];

export default function Menu() {
  const { profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`}>
        <Link to="/feed" className={styles.brand}>
          UAO Connect
        </Link>

        <button className={styles.toggle} onClick={() => setOpen(!open)} aria-label="Abrir menú">
          ☰
        </button>

        <div className={`${styles.links} ${open ? styles.open : ""}`} onClick={() => setOpen(false)}>
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
          {profile && (
            <NavLink to={`/profile/${profile.id}`} className={linkClass}>
              {profile.name.split(" ")[0]}
            </NavLink>
          )}
          <button className={styles.logout} onClick={handleLogout}>
            Salir
          </button>
        </div>
      </nav>
    </header>
  );
}
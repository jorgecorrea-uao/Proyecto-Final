import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authErrorMessage } from "../../helpers/utils";
import styles from "./Login.module.scss";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from ?? "/feed", { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setSending(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>UAO Connect</h1>
        <p className={styles.subtitle}>Inicia sesión para ver a tus compañeros</p>

        <label className={styles.field}>
          Correo
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className={styles.field}>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} disabled={sending}>
          {sending ? "Entrando..." : "Iniciar sesión"}
        </button>

        <p className={styles.footer}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </main>
  );
}
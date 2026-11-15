import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authErrorMessage } from "../../helpers/utils";
import styles from "./Register.module.scss";

const CAREERS = [
  "Ingeniería Informática",
  "Ingeniería de Datos e Inteligencia Artificial",
  "Ingeniería Industrial",
  "Ingeniería Mecatrónica",
  "Ingeniería Biomédica",
  "Ingeniería Electrónica y Telecomunicaciones",
  "Administración de Empresas",
  "Comunicación Social - Periodismo",
  "Diseño de la Comunicación Gráfica",
  "Otra",
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", career: CAREERS[0], email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 3) return setError("Escribe tu nombre completo");
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden");

    setSending(true);
    try {
      await register(form);
      navigate("/feed", { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setSending(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>Únete a la red de estudiantes de la UAO</p>

        <label className={styles.field}>
          Nombre completo
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label className={styles.field}>
          Carrera
          <select name="career" value={form.career} onChange={handleChange}>
            {CAREERS.map((career) => (
              <option key={career}>{career}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          Correo
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className={styles.field}>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
        </label>

        <label className={styles.field}>
          Confirmar contraseña
          <input type="password" name="confirm" value={form.confirm} onChange={handleChange} minLength={6} required />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} disabled={sending}>
          {sending ? "Creando cuenta..." : "Registrarme"}
        </button>

        <p className={styles.footer}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}
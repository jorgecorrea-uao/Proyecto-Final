import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Index.module.scss";

export default function Index() {
  const { user } = useAuth();

  return (
    <main className={styles.hero}>
      <h1 className={styles.title}>UAO Connect</h1>
      <p className={styles.text}>
        La red social de los estudiantes de la UAO. Encuentra compañeros, comparte publicaciones y chatea en tiempo real.
      </p>
      <div className={styles.actions}>
        {user ? (
          <Link className={styles.primary} to="/feed">
            Ir al feed
          </Link>
        ) : (
          <>
            <Link className={styles.primary} to="/register">
              Crear cuenta
            </Link>
            <Link className={styles.secondary} to="/login">
              Iniciar sesión
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { acceptFriendRequest, deleteFriendRequest } from "../../services/friends";
import { timeAgo } from "../../helpers/utils";
import Avatar from "../Shared/Avatar";
import styles from "./FriendRequests.module.scss";

export default function FriendRequests({ queue }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const next = queue.peek();
  const waiting = queue.slice(1);

  const attend = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action(next);
    } catch {
      setError("No se pudo procesar la solicitud");
    }
    setBusy(false);
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>
        Solicitudes de amistad <span className={styles.count}>{queue.size()}</span>
      </h2>

      {queue.isEmpty() ? (
        <p className={styles.empty}>No tienes solicitudes pendientes</p>
      ) : (
        <>
          <p className={styles.label}>Siguiente en la cola</p>
          <div className={styles.next}>
            <Link to={`/profile/${next.from}`}>
              <Avatar name={next.fromName} size={48} />
            </Link>
            <div className={styles.info}>
              <Link to={`/profile/${next.from}`} className={styles.name}>
                {next.fromName}
              </Link>
              <span className={styles.meta}>
                {next.fromCareer} · {timeAgo(next.createdAt)}
              </span>
            </div>
            <div className={styles.actions}>
              <button className={styles.accept} disabled={busy} onClick={() => attend(acceptFriendRequest)}>
                Aceptar
              </button>
              <button className={styles.reject} disabled={busy} onClick={() => attend((r) => deleteFriendRequest(r.id))}>
                Rechazar
              </button>
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}

          {waiting.length > 0 && (
            <>
              <p className={styles.label}>En espera</p>
              <ol className={styles.waiting}>
                {waiting.map((request, index) => (
                  <li key={request.id}>
                    <span className={styles.position}>{index + 2}</span>
                    <Avatar name={request.fromName} size={28} />
                    <span>{request.fromName}</span>
                    <span className={styles.meta}>{timeAgo(request.createdAt)}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </>
      )}
    </section>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteReportedPost, dismissReports } from "../../services/reports";
import { timeAgo } from "../../helpers/utils";
import Avatar from "../Shared/Avatar";
import styles from "./ReportQueue.module.scss";

export default function ReportQueue({ queue }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const next = queue.peek();
  const waiting = queue.slice(1);

  const attend = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch {
      setError("No se pudo procesar el reporte");
    }
    setBusy(false);
  };

  const handleDelete = () => {
    if (window.confirm("¿Eliminar esta publicación definitivamente?")) {
      attend(() => deleteReportedPost(next.postId, next.reports));
    }
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>
        Cola de reportes <span className={styles.count}>{queue.size()}</span>
      </h2>

      {queue.isEmpty() ? (
        <p className={styles.empty}>No hay reportes pendientes</p>
      ) : (
        <>
          <p className={styles.label}>Siguiente por atender</p>
          <article className={styles.next}>
            <header className={styles.header}>
              <Avatar name={next.postAuthorName} size={40} />
              <div className={styles.info}>
                <Link to={`/profile/${next.postAuthorId}`} className={styles.name}>
                  {next.postAuthorName}
                </Link>
                <span className={styles.meta}>
                  {next.reports.length} {next.reports.length === 1 ? "reporte" : "reportes"} · primero{" "}
                  {timeAgo(next.firstReportAt)}
                </span>
              </div>
            </header>

            <p className={styles.post}>{next.postText}</p>

            <ul className={styles.reasons}>
              {next.reports.map((report) => (
                <li key={report.id}>
                  <strong>{report.reporterName}:</strong> {report.reason}
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <button className={styles.delete} disabled={busy} onClick={handleDelete}>
                Eliminar publicación
              </button>
              <button className={styles.dismiss} disabled={busy} onClick={() => attend(() => dismissReports(next.reports))}>
                Descartar reporte
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </article>

          {waiting.length > 0 && (
            <>
              <p className={styles.label}>En espera</p>
              <ol className={styles.waiting}>
                {waiting.map((group, index) => (
                  <li key={group.postId}>
                    <span className={styles.position}>{index + 2}</span>
                    <span className={styles.preview}>{group.postText}</span>
                    <span className={styles.meta}>
                      {group.reports.length} · {timeAgo(group.firstReportAt)}
                    </span>
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
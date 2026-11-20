import { useUsers } from "../../hooks/useUsers";
import { usePosts } from "../../hooks/usePosts";
import { useReports } from "../../hooks/useReports";
import ReportQueue from "../../components/Admin/ReportQueue";
import Loader from "../../components/Shared/Loader";
import styles from "./Admin.module.scss";

export default function Admin() {
  const { users, loading: loadingUsers } = useUsers();
  const { posts } = usePosts();
  const { queue, total, loading } = useReports();

  if (loading || loadingUsers) return <Loader />;

  const stats = [
    { label: "Usuarios", value: users.length },
    { label: "Publicaciones", value: posts.length },
    { label: "Reportes pendientes", value: total },
  ];

  return (
    <main className={`container ${styles.page}`}>
      <h1 className={styles.title}>Panel de administración</h1>

      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>

      <ReportQueue queue={queue} />
    </main>
  );
}
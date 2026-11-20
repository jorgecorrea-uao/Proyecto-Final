import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { useFriendRequests } from "../../hooks/useFriendRequests";
import FriendRequests from "../../components/Friends/FriendRequests";
import FriendButton from "../../components/Friends/FriendButton";
import UserCard from "../../components/Shared/UserCard";
import Loader from "../../components/Shared/Loader";
import styles from "./Friends.module.scss";

export default function Friends() {
  const { profile } = useAuth();
  const { users, loading } = useUsers();
  const { queue, incoming, outgoing } = useFriendRequests(profile?.id);

  if (!profile || loading) return <Loader />;

  const friendIds = profile.friends ?? [];
  const others = users
    .filter((u) => u.id !== profile.id && !friendIds.includes(u.id))
    .sort((a, b) => (b.career === profile.career) - (a.career === profile.career) || a.name.localeCompare(b.name));

  return (
    <main className={`container ${styles.page}`}>
      <h1 className={styles.title}>Amigos</h1>

      <FriendRequests queue={queue} />

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Compañeros de la UAO</h2>
        {others.length === 0 ? (
          <p className={styles.empty}>No hay más compañeros por ahora</p>
        ) : (
          others.map((user) => (
            <UserCard key={user.id} user={user}>
              <FriendButton profile={profile} user={user} incoming={incoming} outgoing={outgoing} />
            </UserCard>
          ))
        )}
      </section>
    </main>
  );
}
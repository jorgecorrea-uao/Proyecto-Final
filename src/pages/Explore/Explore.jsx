import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { useFriendRequests } from "../../hooks/useFriendRequests";
import { useUserSearch } from "../../hooks/useUserSearch";
import UserCard from "../../components/Shared/UserCard";
import FriendButton from "../../components/Friends/FriendButton";
import Loader from "../../components/Shared/Loader";
import styles from "./Explore.module.scss";

export default function Explore() {
  const { profile } = useAuth();
  const { users, loading } = useUsers();
  const { incoming, outgoing } = useFriendRequests(profile?.id);
  const search = useUserSearch(users);
  const [text, setText] = useState("");

  if (loading || !profile) return <Loader />;

  const results = search(text).filter((u) => u.id !== profile.id);

  return (
    <main className={`container ${styles.page}`}>
      <h1 className={styles.title}>Explorar</h1>

      <section className={styles.card}>
        <input
          className={styles.search}
          placeholder="Busca compañeros por nombre o apellido..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />

        {text.trim() === "" ? (
          <p className={styles.hint}>Escribe las primeras letras de un nombre, por ejemplo "jor" o "corr"</p>
        ) : results.length === 0 ? (
          <p className={styles.hint}>No hay compañeros que coincidan con "{text}"</p>
        ) : (
          <>
            <p className={styles.hint}>
              {results.length} {results.length === 1 ? "resultado" : "resultados"}
            </p>
            {results.map((user) => (
              <UserCard key={user.id} user={user}>
                <FriendButton profile={profile} user={user} incoming={incoming} outgoing={outgoing} />
              </UserCard>
            ))}
          </>
        )}
      </section>
    </main>
  );
}
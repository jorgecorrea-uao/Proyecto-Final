import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { useFriendRequests } from "../../hooks/useFriendRequests";
import { useUserSearch } from "../../hooks/useUserSearch";
import { usePosts } from "../../hooks/usePosts";
import { useTrending } from "../../hooks/useTrending";
import UserCard from "../../components/Shared/UserCard";
import FriendButton from "../../components/Friends/FriendButton";
import PostCard from "../../components/Feed/PostCard";
import Loader from "../../components/Shared/Loader";
import styles from "./Explore.module.scss";

export default function Explore() {
  const { profile } = useAuth();
  const { users, loading } = useUsers();
  const { incoming, outgoing } = useFriendRequests(profile?.id);
  const search = useUserSearch(users);
  const [text, setText] = useState("");
  const [k, setK] = useState(5);
  const { posts } = usePosts();
  const trending = useTrending(posts, k);

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
          <p className={styles.hint}>Escribe las primeras letras de un nombre"</p>
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

      <section className={styles.trending}>
        <div className={styles.trendingHeader}>
          <h2 className={styles.subtitle}>Tendencias de la semana</h2>
          <label className={styles.topK}>
            Top
            <select value={k} onChange={(e) => setK(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </label>
        </div>

        {trending.length === 0 ? (
          <p className={styles.hint}>Todavía no hay publicaciones con likes esta semana</p>
        ) : (
          trending.map((post, index) => (
            <div key={post.id} className={styles.rank}>
              <span className={styles.position}>#{index + 1}</span>
              <PostCard post={post} />
            </div>
          ))
        )}
      </section>
    </main>
  );
}
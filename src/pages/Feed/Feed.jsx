import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import CreatePost from "../../components/Feed/CreatePost";
import PostCard from "../../components/Feed/PostCard";
import Loader from "../../components/Shared/Loader";
import styles from "./Feed.module.scss";

export default function Feed() {
  const { profile } = useAuth();
  const { posts, loading, error } = usePosts();
  const friends = profile?.friends ?? [];
  const [tab, setTab] = useState(friends.length > 0 ? "friends" : "all");

  const visiblePosts =
    tab === "friends" ? posts.filter((p) => p.authorId === profile?.id || friends.includes(p.authorId)) : posts;

  return (
    <main className={`container ${styles.feed}`}>
      <CreatePost />

      <div className={styles.tabs}>
        <button className={tab === "friends" ? styles.activeTab : styles.tab} onClick={() => setTab("friends")}>
          Mis amigos
        </button>
        <button className={tab === "all" ? styles.activeTab : styles.tab} onClick={() => setTab("all")}>
          Todos
        </button>
      </div>

      {loading && <Loader />}
      {error && <p className={styles.empty}>No se pudieron cargar las publicaciones</p>}

      {!loading && !error && visiblePosts.length === 0 && (
        <p className={styles.empty}>
          {tab === "friends" ? (
            <>
              Todavía no hay publicaciones de tus amigos. <Link to="/friends">Busca compañeros</Link> o mira la
              pestaña Todos.
            </>
          ) : (
            "Nadie ha publicado todavía. ¡Sé el primero!"
          )}
        </p>
      )}

      {visiblePosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}
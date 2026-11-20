import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { deletePost, toggleLike } from "../../services/posts";
import { reportPost } from "../../services/reports";
import { timeAgo } from "../../helpers/utils";
import Avatar from "../Shared/Avatar";
import styles from "./PostCard.module.scss";

export default function PostCard({ post }) {
  const { profile, isAdmin } = useAuth();
  const canDelete = profile && (post.authorId === profile.id || isAdmin);
  const liked = profile ? post.likes.includes(profile.id) : false;
  const canReport = profile && post.authorId !== profile.id;
  const [reported, setReported] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("¿Eliminar esta publicación?")) {
      await deletePost(post.id);
    }
  };

  const handleLike = () => {
    if (profile) toggleLike(post, profile.id);
  };

  const handleReport = async () => {
    const reason = window.prompt("¿Por qué quieres reportar esta publicación?");
    if (!reason || !reason.trim()) return;
    await reportPost(post, profile, reason);
    setReported(true);
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <Link to={`/profile/${post.authorId}`}>
          <Avatar name={post.authorName} />
        </Link>
        <div className={styles.meta}>
          <Link to={`/profile/${post.authorId}`} className={styles.name}>
            {post.authorName}
          </Link>
          <span className={styles.info}>
            {post.authorCareer} · {timeAgo(post.createdAt)}
          </span>
        </div>
        {canDelete && (
          <button className={styles.delete} onClick={handleDelete}>
            Eliminar
          </button>
        )}
      </header>

      <p className={styles.text}>{post.text}</p>

      <footer className={styles.footer}>
        <button className={liked ? styles.liked : styles.like} onClick={handleLike}>
          {liked ? "♥" : "♡"} {post.likesCount}
        </button>
        {canReport && (
          <button className={styles.report} onClick={handleReport} disabled={reported}>
            {reported ? "Reportado" : "Reportar"}
          </button>
        )}
      </footer>
    </article>
  );
}
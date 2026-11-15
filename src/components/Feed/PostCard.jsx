import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { deletePost } from "../../services/posts";
import { timeAgo } from "../../helpers/utils";
import Avatar from "../Shared/Avatar";
import styles from "./PostCard.module.scss";

export default function PostCard({ post }) {
  const { profile, isAdmin } = useAuth();
  const canDelete = profile && (post.authorId === profile.id || isAdmin);

  const handleDelete = async () => {
    if (window.confirm("¿Eliminar esta publicación?")) {
      await deletePost(post.id);
    }
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
    </article>
  );
}
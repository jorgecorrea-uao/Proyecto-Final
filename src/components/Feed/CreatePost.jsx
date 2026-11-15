import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { createPost } from "../../services/posts";
import Avatar from "../Shared/Avatar";
import styles from "./CreatePost.module.scss";

const MAX_LENGTH = 500;

export default function CreatePost() {
  const { profile } = useAuth();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError("");
    try {
      await createPost(profile, text);
      setText("");
    } catch {
      setError("No se pudo publicar, intenta de nuevo");
    }
    setSending(false);
  };

  if (!profile) return null;

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <Avatar name={profile.name} />
      <div className={styles.body}>
        <textarea
          className={styles.input}
          placeholder={`¿Qué estás pensando, ${profile.name.split(" ")[0]}?`}
          value={text}
          maxLength={MAX_LENGTH}
          rows={3}
          onChange={(e) => setText(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <span className={styles.counter}>
            {text.length}/{MAX_LENGTH}
          </span>
          <button className={styles.button} disabled={sending || !text.trim()}>
            {sending ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>
    </form>
  );
}
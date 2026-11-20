import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { chatIdFor, sendMessage } from "../../services/chat";
import { useMessages } from "../../hooks/useMessages";
import Avatar from "../Shared/Avatar";
import styles from "./ChatWindow.module.scss";

const formatHour = (date) => date.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" });

export default function ChatWindow({ profile, friend }) {
  const { messages, loading } = useMessages(chatIdFor(profile.id, friend.id));
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const message = text;
    setText("");
    setError("");
    try {
      await sendMessage(profile.id, friend.id, message);
    } catch {
      setText(message);
      setError("No se pudo enviar el mensaje");
    }
  };

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <Link to="/chat" className={styles.back}>
          ←
        </Link>
        <Avatar name={friend.name} size={38} />
        <Link to={`/profile/${friend.id}`} className={styles.name}>
          {friend.name}
        </Link>
      </header>

      <div className={styles.messages}>
        {!loading && messages.length === 0 && (
          <p className={styles.empty}>Escríbele a {friend.name.split(" ")[0]} para empezar la conversación</p>
        )}
        {messages.map((message) => {
          const mine = message.senderId === profile.id;
          return (
            <div key={message.id} className={mine ? styles.mine : styles.theirs}>
              <p className={styles.text}>{message.text}</p>
              <span className={styles.time}>{formatHour(message.createdAt)}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}
        <input
          className={styles.input}
          placeholder="Escribe un mensaje..."
          value={text}
          maxLength={1000}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <button className={styles.send} disabled={!text.trim()}>
          Enviar
        </button>
      </form>
    </section>
  );
}
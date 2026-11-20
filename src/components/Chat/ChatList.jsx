import { NavLink } from "react-router-dom";
import { timeAgo } from "../../helpers/utils";
import Avatar from "../Shared/Avatar";
import styles from "./ChatList.module.scss";

export default function ChatList({ profile, chats, friends, usersById }) {
  const withChat = new Set(chats.map((chat) => chat.friendId));
  const newFriends = friends.filter((friend) => !withChat.has(friend.id));

  const itemClass = ({ isActive }) => (isActive ? `${styles.item} ${styles.active}` : styles.item);

  return (
    <aside className={styles.list}>
      <h2 className={styles.title}>Mensajes</h2>

      {chats.length === 0 && newFriends.length === 0 && (
        <p className={styles.empty}>Agrega amigos para empezar a chatear</p>
      )}

      {chats.map((chat) => {
        const friend = usersById[chat.friendId];
        if (!friend) return null;
        const mine = chat.lastSenderId === profile.id;
        return (
          <NavLink key={chat.id} to={`/chat/${friend.id}`} className={itemClass}>
            <Avatar name={friend.name} size={40} />
            <div className={styles.info}>
              <div className={styles.row}>
                <span className={styles.name}>{friend.name}</span>
                <span className={styles.time}>{timeAgo(chat.updatedAt)}</span>
              </div>
              <span className={styles.preview}>
                {mine ? "Tú: " : ""}
                {chat.lastMessage}
              </span>
            </div>
          </NavLink>
        );
      })}

      {newFriends.length > 0 && (
        <>
          <p className={styles.label}>Iniciar conversación</p>
          {newFriends.map((friend) => (
            <NavLink key={friend.id} to={`/chat/${friend.id}`} className={itemClass}>
              <Avatar name={friend.name} size={40} />
              <div className={styles.info}>
                <span className={styles.name}>{friend.name}</span>
                <span className={styles.preview}>{friend.career}</span>
              </div>
            </NavLink>
          ))}
        </>
      )}
    </aside>
  );
}
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { useChats } from "../../hooks/useChats";
import ChatList from "../../components/Chat/ChatList";
import ChatWindow from "../../components/Chat/ChatWindow";
import Loader from "../../components/Shared/Loader";
import styles from "./Chat.module.scss";

export default function Chat() {
  const { friendId } = useParams();
  const { profile } = useAuth();
  const { usersById, loading } = useUsers();
  const chats = useChats(profile?.id);

  if (loading || !profile) return <Loader />;

  const friends = (profile.friends ?? []).map((id) => usersById[id]).filter(Boolean);
  const friend = friendId ? usersById[friendId] : null;
  const canChat = friend && (profile.friends ?? []).includes(friend.id);

  return (
    <main className={`container ${styles.page} ${friendId ? styles.chatOpen : ""}`}>
      <ChatList profile={profile} chats={chats} friends={friends} usersById={usersById} />

      {!friendId && <div className={styles.placeholder}>Elige una conversación</div>}

      {friendId && !canChat && (
        <div className={styles.placeholder}>Solo puedes chatear con tus amigos</div>
      )}

      {canChat && <ChatWindow key={friend.id} profile={profile} friend={friend} />}
    </main>
  );
}
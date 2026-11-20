import { useAuth } from "../../hooks/useAuth";
import { useFriendRequests } from "../../hooks/useFriendRequests";
import FriendRequests from "../../components/Friends/FriendRequests";
import styles from "./Friends.module.scss";

export default function Friends() {
  const { profile } = useAuth();
  const { queue } = useFriendRequests(profile?.id);

  return (
    <main className={`container ${styles.page}`}>
      <h1 className={styles.title}>Amigos</h1>
      <FriendRequests queue={queue} />
    </main>
  );
}
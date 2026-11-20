import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { useFriendRequests } from "../../hooks/useFriendRequests";
import { useFriendGraph } from "../../hooks/useFriendGraph";
import { removeFriend } from "../../services/friends";
import FriendRequests from "../../components/Friends/FriendRequests";
import FriendButton from "../../components/Friends/FriendButton";
import UserCard from "../../components/Shared/UserCard";
import Loader from "../../components/Shared/Loader";
import styles from "./Friends.module.scss";

export default function Friends() {
  const { profile } = useAuth();
  const { users, usersById, loading } = useUsers();
  const { queue, incoming, outgoing } = useFriendRequests(profile?.id);
  const graph = useFriendGraph(users);

  if (!profile || loading) return <Loader />;

  const friendIds = profile.friends ?? [];
  const friends = friendIds.map((id) => usersById[id]).filter(Boolean);

  const suggestions = graph
    .suggestFriends(profile.id, 5)
    .map((s) => ({ user: usersById[s.id], mutual: s.mutual }))
    .filter((s) => s.user);

  const suggestedIds = suggestions.map((s) => s.user.id);
  const others = users
    .filter((u) => u.id !== profile.id && !friendIds.includes(u.id) && !suggestedIds.includes(u.id))
    .sort((a, b) => (b.career === profile.career) - (a.career === profile.career) || a.name.localeCompare(b.name));

  const handleRemove = (friend) => {
    if (window.confirm(`¿Eliminar a ${friend.name} de tus amigos?`)) {
      removeFriend(profile.id, friend.id);
    }
  };

  const button = (user) => <FriendButton profile={profile} user={user} incoming={incoming} outgoing={outgoing} />;

  return (
    <main className={`container ${styles.page}`}>
      <h1 className={styles.title}>Amigos</h1>

      <FriendRequests queue={queue} />

      {suggestions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.subtitle}>Personas que quizás conozcas</h2>
          {suggestions.map(({ user, mutual }) => (
            <UserCard
              key={user.id}
              user={user}
              subtitle={`${mutual} ${mutual === 1 ? "amigo" : "amigos"} en común · ${user.career}`}
            >
              {button(user)}
            </UserCard>
          ))}
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Mis amigos ({friends.length})</h2>
        {friends.length === 0 ? (
          <p className={styles.empty}>Todavía no tienes amigos. Agrega compañeros de la lista de abajo.</p>
        ) : (
          friends.map((friend) => (
            <UserCard key={friend.id} user={friend}>
              <Link to={`/chat/${friend.id}`} className={styles.message}>
                Mensaje
              </Link>
              <button className={styles.remove} onClick={() => handleRemove(friend)}>
                Eliminar
              </button>
            </UserCard>
          ))
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Compañeros de la UAO</h2>
        {others.length === 0 ? (
          <p className={styles.empty}>No hay más compañeros por ahora</p>
        ) : (
          others.map((user) => (
            <UserCard key={user.id} user={user}>
              {button(user)}
            </UserCard>
          ))
        )}
      </section>
    </main>
  );
}
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { usePosts } from "../../hooks/usePosts";
import { useFriendRequests } from "../../hooks/useFriendRequests";
import { useFriendGraph } from "../../hooks/useFriendGraph";
import { useVisitedProfiles } from "../../hooks/useVisitedProfiles";
import Avatar from "../../components/Shared/Avatar";
import Loader from "../../components/Shared/Loader";
import UserCard from "../../components/Shared/UserCard";
import FriendButton from "../../components/Friends/FriendButton";
import PostCard from "../../components/Feed/PostCard";
import styles from "./Profile.module.scss";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { users, usersById, loading } = useUsers();
  const { posts } = usePosts();
  const { incoming, outgoing } = useFriendRequests(profile?.id);
  const graph = useFriendGraph(users);
  const { stack, visit, back } = useVisitedProfiles();

  const user = usersById[id];
  const isMe = profile?.id === id;

  useEffect(() => {
    if (user && !isMe) visit(id);
  }, [id, user, isMe, visit]);

  if (loading || !profile) return <Loader />;

  if (!user) {
    return (
      <main className="container">
        <h1>Usuario no encontrado</h1>
        <Link to="/friends">Volver a amigos</Link>
      </main>
    );
  }

  const userPosts = posts.filter((p) => p.authorId === id);
  const isFriend = (profile.friends ?? []).includes(id);
  const mutual = isMe ? [] : graph.mutualFriends(profile.id, id).map((fid) => usersById[fid]).filter(Boolean);
  const visited = [...stack].reverse().filter((vid) => vid !== id).map((vid) => usersById[vid]).filter(Boolean);

  const handleBack = () => {
    const previous = back();
    navigate(previous ? `/profile/${previous}` : "/friends");
  };

  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.header}>
        <Avatar name={user.name} size={88} />
        <div className={styles.info}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.career}>{user.career}</p>
          <p className={styles.stats}>
            <strong>{(user.friends ?? []).length}</strong> amigos · <strong>{userPosts.length}</strong> publicaciones
          </p>
        </div>
        <div className={styles.actions}>
          {isMe ? (
            <span className={styles.me}>Este es tu perfil</span>
          ) : (
            <>
              <FriendButton profile={profile} user={user} incoming={incoming} outgoing={outgoing} />
              {isFriend && (
                <Link to={`/chat/${id}`} className={styles.message}>
                  Mensaje
                </Link>
              )}
            </>
          )}
        </div>
      </section>

      <div className={styles.layout}>
        <section className={styles.posts}>
          <h2 className={styles.subtitle}>Publicaciones</h2>
          {userPosts.length === 0 ? (
            <p className={styles.empty}>Todavía no ha publicado nada</p>
          ) : (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>

        <aside className={styles.side}>
          {mutual.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.subtitle}>Amigos en común ({mutual.length})</h2>
              {mutual.map((friend) => (
                <UserCard key={friend.id} user={friend} />
              ))}
            </section>
          )}

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.subtitle}>Visitados recientemente</h2>
              {!isMe && (
                <button className={styles.back} onClick={handleBack}>
                  ← Atrás
                </button>
              )}
            </div>
            {visited.length === 0 ? (
              <p className={styles.empty}>Aquí aparecerán los perfiles que visites</p>
            ) : (
              visited.map((visitedUser) => <UserCard key={visitedUser.id} user={visitedUser} />)
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
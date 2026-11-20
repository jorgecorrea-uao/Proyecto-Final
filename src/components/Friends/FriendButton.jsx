import { useState } from "react";
import { acceptFriendRequest, deleteFriendRequest, sendFriendRequest } from "../../services/friends";
import styles from "./FriendButton.module.scss";

export default function FriendButton({ profile, user, incoming, outgoing }) {
  const [busy, setBusy] = useState(false);

  if (!profile || profile.id === user.id) return null;

  const isFriend = (profile.friends ?? []).includes(user.id);
  const sent = outgoing.find((r) => r.to === user.id);
  const received = incoming.find((r) => r.from === user.id);

  const run = async (action) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  if (isFriend) {
    return <span className={styles.friend}>Amigos</span>;
  }

  if (received) {
    return (
      <button className={styles.primary} disabled={busy} onClick={() => run(() => acceptFriendRequest(received))}>
        Aceptar
      </button>
    );
  }

  if (sent) {
    return (
      <button className={styles.secondary} disabled={busy} onClick={() => run(() => deleteFriendRequest(sent.id))}>
        Cancelar solicitud
      </button>
    );
  }

  return (
    <button className={styles.primary} disabled={busy} onClick={() => run(() => sendFriendRequest(profile, user))}>
      Agregar
    </button>
  );
}
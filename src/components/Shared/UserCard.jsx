import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import styles from "./UserCard.module.scss";

export default function UserCard({ user, subtitle, children }) {
  return (
    <div className={styles.card}>
      <Link to={`/profile/${user.id}`}>
        <Avatar name={user.name} size={44} />
      </Link>
      <div className={styles.info}>
        <Link to={`/profile/${user.id}`} className={styles.name}>
          {user.name}
        </Link>
        <span className={styles.subtitle}>{subtitle ?? user.career}</span>
      </div>
      {children}
    </div>
  );
}
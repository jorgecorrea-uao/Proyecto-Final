import { getInitials } from "../../helpers/utils";
import styles from "./Avatar.module.scss";

const COLORS = ["#e11d48", "#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2"];

const colorFor = (text = "") => COLORS[[...text].reduce((sum, c) => sum + c.charCodeAt(0), 0) % COLORS.length];

export default function Avatar({ name, size = 40 }) {
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.4, background: colorFor(name) }}
    >
      {getInitials(name)}
    </span>
  );
}
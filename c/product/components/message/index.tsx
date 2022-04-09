import styles from "./styles.module.css";
import Link from "next/link";

export default function Message(props: { message: string; error: boolean }) {
  return (
    <div
      className={styles.bar}
      style={props.error ? { background: "var(--red)" } : {}}
    >
      {props.message}
    </div>
  );
}

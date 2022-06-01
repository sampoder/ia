import styles from "./styles.module.css";

/* This file exports a component that is used to display a message 
at the top of the screen. It's used for error messages. */

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

import styles from "./styles.module.css";

export default function Button(props: any) {
  return <button className={styles.button} {...props} />;
}

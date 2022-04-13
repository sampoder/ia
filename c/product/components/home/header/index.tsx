import styles from "./styles.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <div
      className={styles.header}
    >
      <div>
        <h1 className={styles.title}>
          Welcome To A Global
          <br /> Debating Community
        </h1>
        <p>
          <Link href="#tournaments">
            <button style={{ marginRight: "10px" }}>Join A Tournament</button>
          </Link>
          <Link href="/event/new">
            <button>Organise A Tournament</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

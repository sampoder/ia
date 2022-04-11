import styles from "./styles.module.css";
import Button from "../../button";
import Link from "next/link";

export default function Header() {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>
          Welcome To A Global
          <br /> Debating Community
        </h1>
        <p>
          <Link href="#tournaments">
            <Button className={styles.join}>Join A Tournament</Button>
          </Link>
          <Link href="/event/new">
            <Button>Organise A Tournament</Button>
          </Link>
        </p>
      </div>
    </div>
  );
}

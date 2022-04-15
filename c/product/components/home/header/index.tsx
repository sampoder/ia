import styles from "./styles.module.css";
import Link from "next/link";
let GeoPattern = require('geopattern');

export default function Header() {
  return (
    <div
      className={styles.header}
      style={{backgroundImage: `linear-gradient(
        270deg,
        rgba(0, 0, 22, 0.8) 50%,
        rgba(0, 0, 18, 0.75) 100%
      ),
      ${GeoPattern.generate(Math.random().toString()).toDataUrl()}`}}
    >
      <div>
        <h1 className={styles.title}>
        Welcome to the Home of Debate.
        </h1>
        <p>
          <Link href="#tournaments">
            <button className={styles.join}>Join A Tournament</button>
          </Link>
          <Link href="/event/new">
            <button>Organise A Tournament</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

import styles from "./styles.module.css";
import { User as UserType } from "@prisma/client";
import Link from "next/link";

export default function Nav(props: { user: UserType | undefined }) {
  return (
    <div className={styles.nav}>
      <div className={styles.logoType}>
        <Link href="/">
          <b>debate.sh</b>
        </Link>
      </div>
      <div>
        {props.user ? (
          <div>
            <img src={props.user?.avatarURL || ""} />

            <div>
              <Link href="/event/new">My profile</Link>
              <br />
              <Link href="/event/new">My tournaments</Link>
              <br />
              <Link href="/event/new">Launch a tournament</Link>
              <br />
              <Link href="/api/logout">Logout</Link>
            </div>
          </div>
        ) : (
          <div>
            <a href="/login">Login</a> | <a href="/register">Register</a>
          </div>
        )}
      </div>
    </div>
  );
}

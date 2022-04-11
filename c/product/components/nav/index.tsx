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
              <Link href="/profile">Edit My Profile</Link>
              <Link href="/tournaments">My Tournaments</Link>
              <Link href="/event/new">Launch A Tournament</Link>
              <Link href="/api/logout">Logout</Link>
            </div>
          </div>
        ) : (
          <div>
            <a href="/login"  style={{textDecoration: 'none'}}>Login</a> | <a href="/register"  style={{textDecoration: 'none'}}>Register</a>
          </div>
        )}
      </div>
    </div>
  );
}

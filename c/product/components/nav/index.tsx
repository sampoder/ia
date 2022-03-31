import styles from "./styles.module.css";
import { User as UserType } from "@prisma/client";

export default function Nav(props: { user: UserType | undefined }) {
  return (
    <div className={styles.nav}>
      <div className={styles.logoType}>
        <b>debate.sh</b>
      </div>
      <div>
        {props.user ? (
          <a href="/api/logout">
            <img src={props.user?.avatarURL || ""} />
          </a>
        ) : (
          <div>
            <a href="/login">Login</a> | <a href="/register">Register</a>
          </div>
        )}
      </div>
    </div>
  );
}

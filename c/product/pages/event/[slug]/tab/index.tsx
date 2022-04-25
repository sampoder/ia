import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
import { User as UserType } from "@prisma/client";
import styles from "./styles.module.css";

export default function TabIndex(props: { user: UserType | undefined }) {
  return (
    <>
      <Nav user={props.user} />
      <div className={styles.holder}>
        <div className={styles.adminBar}>
          <button>Generate Next Round</button>
          <button>Scoring Status</button>
        </div>
        <div className={styles.blank}>
          The organising team hasn't generated the first round yet. Check back
          later!
        </div>
        <div className={styles.bar}>
          <button>Draw</button>
          <button>Team Standings</button>
          <button>Speaker Standings</button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("./../../../api/user");
  const { res } = context;
  let user = await fetchUser(context.req.cookies["auth"]);
  if (user == null) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  return { props: { user } };
};

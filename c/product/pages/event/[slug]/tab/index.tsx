import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
import { Tournament, User as UserType } from "@prisma/client";
import styles from "./styles.module.css";
import Link from "next/link";
import { fetchTournament } from "../../../api/event/[slug]";

export default function TabIndex(props: {
  user: UserType | undefined;
  tournament: Tournament | undefined;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div className={styles.holder}>
        <div className={styles.adminBar}>
          <Link
            href={`/event/wtp-2/tab/round/${
              //@ts-ignore
              props.tournament?.rounds.sort((a, b) =>
                a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
              ).filter(round => !round.completed)[0].id
            }/availability`}
          >
            <button>Generate Next Round</button>
          </Link>
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
  if (user == null || !context?.params?.slug) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  let tournament = await fetchTournament(context?.params?.slug);
  return { props: { user, tournament } };
};

import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
import { Tournament, User as UserType, DebateRound } from "@prisma/client";
import styles from "./styles.module.css";
import Link from "next/link";
import { fetchTournament } from "../../../api/event/[slug]";

export default function TabIndex(props: {
  user: UserType | undefined;
  tournament: (Tournament & { rounds: DebateRound[] }) | undefined;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div className={styles.holder}>
        <div className={styles.adminBar}>
          <a
            href={`/event/${props.tournament?.slug}/tab/round/${
              props.tournament?.rounds
                .sort((a: DebateRound, b: DebateRound) =>
                  a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
                )
                .filter((round: DebateRound) => !round.complete)[0].id
            }/availability`}
          >
            <button>Generate Next Round</button>
          </a>
        </div>
        <div className={styles.bar}>
          <button>Draw</button>
          <button>Team Standings</button>
          <button>Speaker Standings</button>
        </div>
        <div className={styles.blank}>
          The organising team hasn't generated the next round yet. Check back
          later!
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
  let tournament = await fetchTournament(context?.params?.slug.toString());
  let upcomingRound = tournament?.rounds
    .sort((a, b) =>
      a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
    )
    .filter((round) => !round.complete)[0];
  console.log(upcomingRound);
  let completedRounds = tournament?.rounds
    .sort((a, b) =>
      a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
    )
    .filter((round) => round.complete);
  if (upcomingRound?.debates.length != 0 && upcomingRound != undefined) {
    res.setHeader(
      "location",
      `/event/${context?.params?.slug}/tab/round/${upcomingRound?.id}`
    );
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  if (completedRounds?.length == tournament?.rounds.length) {
    if (tournament?.breakLevel == 0) {
      res.setHeader(
        "location",
        `/event/${context?.params?.slug}/tab/standings`
      );
      res.statusCode = 302;
      res.end();
      return { props: {} };
    } else {
      res.setHeader("location", `/event/${context?.params?.slug}/tab/break`);
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }
  }
  return { props: { user, tournament } };
};

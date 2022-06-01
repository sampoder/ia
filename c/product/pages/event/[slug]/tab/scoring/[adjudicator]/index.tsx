import { GetServerSideProps } from "next";
import Nav from "../../../../../../components/nav";
import { fetchTournament } from "../../../../../api/event/[slug]";
import { prisma } from "../../../../../../lib/prisma";
import {
  Adjudicator,
  AdjudicatorDebateRelationship,
  Debate,
  DebateRound,
  Room,
  RoomDebateRelationship,
  Score,
  Team,
  Tournament,
  User,
} from "@prisma/client";
import styles from "./styles.module.css";

export default function AdjPrivatePage(props: {
  adjudicator: Adjudicator & {
    user: User;
    debates: (AdjudicatorDebateRelationship & {
      debate: Debate & {
        proposition: Team;
        opposition: Team;
        round: DebateRound;
        room: RoomDebateRelationship & { room: Room };
        scores: Score[];
      };
    })[];
  };
  user: User | null;
  tournament: Tournament;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div className={styles.holder}>
        <br />
        <h1 style={{ textAlign: "center", marginTop: "16px" }}>
          Adjudication Dashboard ({props.tournament.name})
        </h1>
        {props.adjudicator.debates
          .sort((a, b) => {
            if (a.debate.round.sequence < b.debate.round.sequence) {
              return -1;
            } else {
              return 1;
            }
          })
          .map((debate) => (
            <a
              href={
                debate.debate.round.complete
                  ? `#`
                  : `/event/${props.tournament.slug}/tab/scoring/${props.adjudicator.id}/${debate.debateId}`
              }
            >
              <div
                className={styles.bar}
                style={{
                  color:
                    debate.debate.round.complete == true
                      ? "var(--muted)"
                      : "inherit",
                }}
              >
                {debate.debate.proposition.name} vs.{" "}
                {debate.debate.opposition.name} (in{" "}
                {debate.debate.room.room.label})
                <span
                  style={{
                    height: "8px",
                    width: "8px",
                    backgroundColor:
                      debate.debate.scores.length ==
                      props.tournament.amountPerTeam * 2
                        ? "var(--green)"
                        : debate.debate.round.complete == true
                        ? "var(--red)"
                        : "var(--orange)",
                    borderRadius: "50%",
                    display: "inline-block",
                    opacity: debate.debate.round.complete == true ? "0.5" : "1",
                  }}
                ></span>
              </div>
            </a>
          ))}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("./../../../../../api/user");
  const { res } = context;
  let user = await fetchUser(context.req.cookies["auth"]);
  if (!context?.params?.slug || !context?.params?.adjudicator) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  let tournament = await fetchTournament(context?.params?.slug.toString());
  let adjudicator = await prisma.adjudicator.findFirst({
    where: {
      id: context?.params?.adjudicator.toString(),
    },
    include: {
      user: true,
      debates: {
        include: {
          debate: {
            include: {
              scores: true,
              proposition: true,
              opposition: true,
              round: true,
              room: {
                include: {
                  room: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return { props: { user, tournament, adjudicator } };
};

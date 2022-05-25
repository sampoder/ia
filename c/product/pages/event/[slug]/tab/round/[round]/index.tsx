import { GetServerSideProps } from "next";
import Nav from "../../../../../../components/nav";
import styles from "./styles.module.css";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  UserTeamRelationship,
  DebateRound,
  RoomRoundRelationship,
  Room,
  Adjudicator,
  Debate,
  AdjudicatorDebateRelationship,
  RoomDebateRelationship,
} from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { prisma } from "../../../../../../lib/prisma";
import { getAdminProps } from "../../../../../../lib/methods/load-admin-props";
import { rankTeams } from "../../../../../../lib/methods/generate-round";

export default function Availability(props: {
  user: UserType | undefined;
  tournament: TournamentType & {
    rooms: (Room & {
      availableFor: RoomRoundRelationship[];
    })[];
    adjudicators: (Adjudicator & {
      user: UserType;
    })[];
    rounds: DebateRound[];
  };
  round: DebateRound & {
    debates: (Debate & {
      proposition: TeamType;
      opposition: TeamType;
      room: RoomDebateRelationship & {
        room: Room;
      };
      adjudicators: (AdjudicatorDebateRelationship & {
        adjudicator: Adjudicator & {
          user: UserType;
        };
      })[];
    })[];
  };
  organisers: UserType[];
  teams: (TeamType & {
    members: (UserTeamRelationship & { user: UserType })[];
  })[];
}) {
  const router = useRouter();
  return (
    <>
      <Nav user={props.user} />
      <form
        className={styles.holder}
        action={`/api/event/${props.tournament.slug}/admin/tab/round/${router.query.round}/availability`}
        method="POST"
      >
        <div className={styles.adminBar}>
          <Link
            href={`/event/wtp-2/tab/round/${
              //@ts-ignore
              props.tournament?.rounds
                .sort((a, b) =>
                  a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
                )
                .filter((round) => !round.completed)[0].id
            }/availability`}
          >
            <button>Generate Next Round</button>
          </Link>
          <button>Scoring Status</button>
        </div>
        <div className={styles.bar}>
          <button>Draw</button>
          <button>Team Standings</button>
          <button>Speaker Standings</button>
        </div>
        <h3>Draw</h3>
        {props.round.debates.map((debate) => (
          <div className={styles.bar}>
            {debate.proposition.name} vs {debate.opposition.name} (Adjudicated
            by {" "}
            {debate.adjudicators[0].adjudicator.user.firstName}{" "}
            {debate.adjudicators[0].adjudicator.user.lastName} in{" "}
            <i>{debate.room.room.label}</i>)
          </div>
        ))}
        <h3>Team Standings</h3>
        {rankTeams(props.tournament.participatingTeams).map((team, index) => (
          <div className={styles.bar}>
            <b>#{index + 1}</b> {team.name} (Wins: {team.wins}) (Points: {team.speakerPoints}) (Draw Strength: {team.drawStrength})
          </div>
        ))}
        <button>Proceed</button>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let ogProps = await getAdminProps(ctx);
  if (ctx.params?.round == undefined) {
    return { props: {} };
  }
  let round = await prisma.debateRound.findUnique({
    where: {
      id: ctx.params.round.toString(),
    },
    include: {
      debates: {
        include: {
          proposition: true,
          opposition: true,
          adjudicators: {
            include: {
              adjudicator: {
                include: {
                  user: true,
                },
              },
            },
          },
          room: {
            include: {
              room: true,
            },
          },
        },
      },
    },
  });
  return { props: { round, ...ogProps.props } };
};

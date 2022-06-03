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
  OrganiserTournamentRelationship,
  Score,
  Team,
} from "@prisma/client";
import Link from "next/link";
import { prisma } from "../../../../../../lib/prisma";
import {
  rankTeams,
  rankSpeakers,
  DebateWithScores,
} from "../../../../../../lib/methods/generate-round";
import { useState } from "react";

/* Page that shows the key details about a round, including:
the draw and the standings. */

export default function Availability(props: {
  user: UserType | undefined;
  speakers: UserType[];
  isOrganising: boolean;
  tournament: TournamentType & {
    participatingTeams: (Team & {
      propositionDebates: DebateWithScores[];
      oppositionDebates: DebateWithScores[];
      members: UserTeamRelationship[];
    })[];
    rooms: (Room & {
      availableFor: RoomRoundRelationship[];
    })[];
    adjudicators: (Adjudicator & {
      user: UserType;
    })[];
    rounds: (DebateRound & {
      debates: (Debate & { scores: (Score & { user: UserType })[] })[];
    })[];
  };
  round: DebateRound & {
    debates: (Debate & {
      proposition: TeamType;
      opposition: TeamType;
      room: RoomDebateRelationship & {
        room: Room;
      };
      scores: (Score & { user: UserType })[];
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
  const [viewing, setViewing] = useState("draw");
  let upcomingRounds = props.tournament?.rounds
    .sort((a, b) =>
      a.sequence > b.sequence ? 1 : b.sequence > a.sequence ? -1 : 0
    )
    .filter((round) => !round.complete);
  return (
    <>
      <Nav user={props.user} />
      <div className={styles.holder}>
        {props.isOrganising && (
          <div className={styles.adminBar}>
            {upcomingRounds[1] ? (
              <>
                <Link
                  href={`/api/event/${props.tournament.slug}/admin/tab/round/${props.round.id}/complete?nextRound=${upcomingRounds[1].id}`}
                >
                  <button>
                    Generate Next Round & Mark This Round As Complete
                  </button>
                </Link>
              </>
            ) : (
              <>
                {props.tournament.breakLevel == 0 ? (
                  <Link
                    href={`/api/event/${props.tournament.slug}/admin/tab/round/${props.round.id}/complete?standings=true`}
                  >
                    <button>
                      Mark This Round As Complete & Show Final Standings
                    </button>
                  </Link>
                ) : (
                  <Link
                    href={`/event/${props.tournament.slug}/tab/round/${props.round.id}/complete`}
                  >
                    <button>
                      Mark This Round As Complete & Generate The Break
                    </button>
                  </Link>
                )}
              </>
            )}
          </div>
        )}
        <div className={styles.bar}>
          <button
            onClick={() => setViewing("draw")}
            style={{ background: viewing == "draw" ? "var(--green)" : "" }}
          >
            Draw
          </button>
          <button
            onClick={() => setViewing("team")}
            style={{ background: viewing == "team" ? "var(--green)" : "" }}
          >
            Team Standings
          </button>
          <button
            onClick={() => setViewing("speaker")}
            style={{ background: viewing == "speaker" ? "var(--green)" : "" }}
          >
            Speaker Standings
          </button>
        </div>
        {viewing == "draw" && (
          <>
            <h3>Draw</h3>
            {props.round.debates.map((debate) => (
              <div className={styles.bar}>
                <span>
                  {debate.proposition.name} vs {debate.opposition.name}{" "}
                  (Adjudicated by{" "}
                  {debate.adjudicators[0].adjudicator.user.firstName}{" "}
                  {debate.adjudicators[0].adjudicator.user.lastName} in{" "}
                  <u>{debate.room.room.label}</u>)
                </span>
                <span
                  style={{
                    height: "8px",
                    width: "8px",
                    backgroundColor:
                      debate.scores.length == props.tournament.amountPerTeam * 2
                        ? "var(--green)"
                        : "var(--orange)",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>
              </div>
            ))}
          </>
        )}
        {viewing == "team" && (
          <>
            <h3>Team Standings</h3>
            {rankTeams(props.tournament.participatingTeams).map(
              (team, index) => (
                <div className={styles.bar}>
                  <b>#{index + 1}</b> {team.name} (Wins: {team.wins}) (Points:{" "}
                  {team.speakerPoints}) (Draw Strength: {team.drawStrength})
                </div>
              )
            )}
          </>
        )}
        {viewing == "speaker" && (
          <>
            <h3>Speaker Standings</h3>
            {rankSpeakers(props.tournament.rounds, props.speakers).map(
              (speaker, index) => (
                <div className={styles.bar}>
                  <b>#{index + 1}</b> {speaker.user.firstName}{" "}
                  {speaker.user.lastName} (Points: {speaker.score})
                </div>
              )
            )}
          </>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
          scores: true,
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
  const {
    fetchTournament,
  } = require("../../../../../../pages/api/event/[slug]/index");
  const { fetchUser } = require("../../../../../../pages/api/user");
  let user: UserType = await fetchUser(ctx.req.cookies["auth"]);
  let tournament = await fetchTournament(ctx.params?.slug, {
    stripeAccount: true,
    rounds: {
      include: {
        debates: {
          include: {
            scores: true,
          },
        },
      },
    },
    rooms: {
      include: { availableFor: true },
    },
    adjudicators: {
      include: { user: true },
    },
  });
  let isOrganising = false;
  tournament.organiserIDs = tournament.organisers.map(
    (x: OrganiserTournamentRelationship) => x.organiserId
  );
  if (tournament.organiserIDs.includes(user.id)) {
    isOrganising = true;
  }
  let speakers = await prisma.user.findMany({
    where: {
      Teams: {
        some: {
          team: {
            tournamentId: tournament.id,
          },
        },
      },
    },
  });
  return { props: { round, speakers, isOrganising, tournament, user } };
};

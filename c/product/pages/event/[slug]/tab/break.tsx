import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
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
  OrganiserTournamentRelationship,
  Score,
  Team,
} from "@prisma/client";
import { prisma } from "../../../../lib/prisma";
import fetch from "isomorphic-unfetch";
import {
  rankTeams,
  DebateWithScores,
} from "../../../../lib/methods/generate-round";
import { SetStateAction, Dispatch, useState, useReducer } from "react";
import { Break } from "../../../../lib/classes/break";

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
    breakStatus: String[][];
  };
  organisers: UserType[];
  teams: (TeamType & {
    members: (UserTeamRelationship & { user: UserType })[];
  })[];
}) {
  let amountOfRounds = props.tournament.breakLevel;
  let breakRound = new Break(
    props.tournament.breakStatus,
    amountOfRounds,
    props.tournament
  );
  const [winners, setWinners]: [
    (null | TeamType)[][],
    Dispatch<SetStateAction<(TeamType | null)[][]>>
  ] = useState(breakRound.status);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  return (
    <>
      <Nav user={props.user} />
      <div
        className={styles.holder}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <h1>{props.tournament.name} Breaks</h1>
        {[...new Array(amountOfRounds)].map((_, index) => (
          <div>
            <b>Round {index + 1}</b>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "16px",
                marginTop: "8px",
              }}
            >
              {[
                ...new Array(
                  Math.pow(2, amountOfRounds) / 2 / (index != 0 ? index * 2 : 1)
                ),
              ].map((_, i) => {
                let [propositionTeam, oppositionTeam] =
                  index == 0
                    ? breakRound.findStartingTeams(i)
                    : breakRound.findSecondaryTeams(index, i, winners);
                function setWinner(team: Team | null, loser: Team | null) {
                  if (props.isOrganising) {
                    let newWinners = breakRound.setWinner(
                      team,
                      loser,
                      index,
                      i,
                      winners
                    );
                    setWinners(newWinners);
                    forceUpdate();
                  }
                }
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      background: "var(--sunken)",
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        borderBottom: "1px solid var(--text)",
                        paddingBottom: "4px",
                      }}
                    >
                      <span
                        onClick={() =>
                          setWinner(propositionTeam, oppositionTeam)
                        }
                        style={{
                          fontWeight:
                            propositionTeam?.name == winners[index][i]?.name
                              ? 800
                              : 400,
                        }}
                      >
                        {propositionTeam?.name || "TBD"}
                      </span>
                      {" vs. "}
                      <span
                        onClick={() =>
                          setWinner(oppositionTeam, propositionTeam)
                        }
                        style={{
                          fontWeight:
                            oppositionTeam?.name == winners[index][i]?.name
                              ? 800
                              : 400,
                        }}
                      >
                        {oppositionTeam?.name || "TBD"}
                      </span>
                    </div>
                    <div>
                      {props.tournament.adjudicators[i].user.firstName}{" "}
                      {props.tournament.adjudicators[i].user.lastName}
                    </div>
                    <div>{props.tournament.rooms[i].label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className={styles.bar}>
          <span>
            <b>Winner:</b> {winners[winners.length - 1][0]?.name}
          </span>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    fetchTournament,
  } = require("../../../../pages/api/event/[slug]/index");
  const { fetchUser } = require("../../../../pages/api/user");
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
  return { props: { speakers, isOrganising, tournament, user } };
};

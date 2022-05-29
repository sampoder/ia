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
import fetch from 'isomorphic-unfetch'
import {
  rankTeams,
  DebateWithScores,
} from "../../../../lib/methods/generate-round";
import { SetStateAction, Dispatch, useState, useReducer, useEffect } from "react";

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
  const [winners, setWinners]: [
    (null | Team)[][],
    Dispatch<SetStateAction<any[][]>>
  ] = useState(
    [...new Array(amountOfRounds)].map((_, i) =>
      [
        ...new Array(Math.pow(2, amountOfRounds) / 2 / (i != 0 ? i * 2 : 1)),
      ].map((_, y) => {
        if (props.tournament.breakStatus == null) {
          return null;
        }
        if (!props.tournament.breakStatus[i]) {
          return null;
        }
        if (!props.tournament.breakStatus[i][y]) {
          return null;
        }
        if (props.tournament.breakStatus[i][y] == "null") {
          return null;
        } else {
          let returnValue = null;
          props.tournament.participatingTeams.map((team) => {
            if (team.id == props.tournament.breakStatus[i][y]) {
              returnValue = team;
              console.log("i should never run");
            }
          });
          return returnValue;
        }
      })
    )
  );
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  async function updateInDB(currentWinners: (null | Team)[][]) {
    fetch(`/api/event/${props.tournament.slug}/admin/tab/break`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        breakStatus: JSON.stringify(
          currentWinners.map((x) => x.map((y) => y?.id || "null"))
        ),
      }),
    });
  
  }
  let colors = ["red", "green", "orange", "red", "purple"];
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
            <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: "16px", marginTop: '8px' }}>
              {[
                ...new Array(
                  Math.pow(2, amountOfRounds) / 2 / (index != 0 ? index * 2 : 1)
                ),
              ].map((_, i) => {
                let propositionTeam =
                  index != 0 && winners[index - 1] == undefined
                    ? null
                    : (index == 0
                        ? rankTeams(props.tournament.participatingTeams)
                        : winners[index - 1])[i];
                let oppositionTeam =
                  index != 0 && winners[index - 1] == undefined
                    ? null
                    : (index == 0
                        ? rankTeams(props.tournament.participatingTeams)
                        : winners[index - 1])[
                        Math.pow(2, amountOfRounds - index) - i - 1
                      ];
                function setWinner(team: Team | null, loser: Team | null) {
                  if(props.isOrganising){
                  let currentWinners = winners;
                  currentWinners[index][i] = team;
                  currentWinners.slice(index).map((roundResult, x) => roundResult.map((team,y) => {
                    if(team?.id == loser?.id){
                      currentWinners[x][y] = null 
                    }
                  }))
                  setWinners(currentWinners);
                  updateInDB(currentWinners);
                  forceUpdate();
                }
                }
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      background: 'var(--sunken)',
                      padding: '12px',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{borderBottom: '1px solid var(--text)', paddingBottom: '4px'}}>
                      <span onClick={() => setWinner(propositionTeam, oppositionTeam)} style={{fontWeight: propositionTeam?.name == winners[index][i]?.name ? 800 : 400}}>
                        {propositionTeam?.name || "TBD"}
                      </span>
                      {" vs. "}
                      <span onClick={() => setWinner(oppositionTeam, propositionTeam)} style={{fontWeight: oppositionTeam?.name == winners[index][i]?.name ? 800 : 400}}>
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
          <span><b>Winner:</b> {winners[winners.length - 1][0]?.name}</span>
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
  console.log("hi!");
  return { props: { speakers, isOrganising, tournament, user } };
};
